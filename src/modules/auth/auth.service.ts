import type { Request, Response } from "express";
import {
  type IUser,
  User,
  UserProviders,
} from "../../database/models/user.model";
import { UserRepository } from "../../database/repository/user.repository";
import { OAuth2Client, type TokenPayload } from "google-auth-library";

import { APP_EMAIL, APP_NAME, WEB_CLIENT_ID } from "../../config/env";
import type {
  LoginBodyDto,
  LogoutBodyDto,
  RegisterWithGmailDto,
  ResetPasswordDto,
  SendForgetPasswordCodeDto,
} from "./dto";
import { eventEmitter, otpGen } from "../../utils/events";
import { compareHash, hashText } from "../../utils/security/hash";
import { emailTemplates } from "../../utils/templates";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  SuccessResponse,
} from "../../utils/response";
import {
  createLoginCredentials,
  createRevokeToken,
  LogoutEnum,
} from "../../utils/tokens";
import type { UpdateQuery } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";
import { uploadFile } from "../../utils/aws/S3";

class AuthService {
  private userModel = new UserRepository(User);

  constructor() {}
  private async verifyGmailAccount({
    idToken,
  }: {
    idToken: string;
  }): Promise<TokenPayload> {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: WEB_CLIENT_ID as string,
    });
    if (!ticket) throw new BadRequestException("Invalid Token");
    const payload = ticket.getPayload();
    if (!payload?.email_verified)
      throw new BadRequestException("Failed to verify this account");
    return payload;
  }

  registerWithGmail = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { idToken }: RegisterWithGmailDto = req.body || {};

    const { email, given_name, family_name, picture }: Partial<TokenPayload> =
      await this.verifyGmailAccount({ idToken });

    let user = await this.userModel.findOne({ email: email as string });

    if (user) {
      if (user.provider === UserProviders.google) {
        return await this.loginWithGmail(req, res);
      }
      throw new ConflictException(
        `Email already exist with ${user.provider} provider`
      );
    }
    user = await this.userModel.createUser({
      data: {
        firstName: given_name as string,
        lastName: family_name as string,
        email: email as string,
        profilePicture: picture as string,
        confirmedAt: new Date(),
        confirmed: true,
        provider: UserProviders.google,
      },
    });
    if (!user)
      throw new BadRequestException(
        "Failed to register with gmail, please try again later"
      );
    const credentials = createLoginCredentials(user);

    return SuccessResponse.created({
      res,
      message: "User registered successfully",
      data: { credentials },
    });
  };

  register = async (req: Request, res: Response): Promise<Response> => {
    await this.userModel.createUser({
      data: {
        ...req.body,
        otpExpiresIn: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      } as Partial<IUser>,
    });

    return SuccessResponse.created({
      res,
      message:
        "User registered successfully, please check your email for verification.",
    });
  };

  verifyEmail = async (req: Request, res: Response): Promise<Response> => {
    const { otp, email } = req.body || {};
    const [user] = await this.userModel.findFilter({
      filter: { email },
    });

    if (user) {
      if (user.confirmed)
        throw new BadRequestException("User already confirmed");
      if (
        user.confirmEmailOtp &&
        !(await compareHash({
          plainText: otp,
          cipherText: user.confirmEmailOtp,
        }))
      )
        throw new BadRequestException("Invalid OTP");
      if (user.otpExpiresIn && user.otpExpiresIn < new Date())
        throw new BadRequestException("OTP expired");

      await this.userModel.updateOne({
        filter: { email },
        update: {
          $set: { confirmed: true, confirmedAt: new Date() },
          $unset: { confirmEmailOtp: "", otpExpiresIn: "" },
        },
      });
      eventEmitter.emit("sendEmail", {
        from: `"${APP_NAME}" <${APP_EMAIL}>`,
        to: user.email,
        subject: "Email Verified",
        text: "Your email address has been successfully verified.",
        html: emailTemplates.welcomeEmail({
          firstName: user.firstName,
        }),
      });

      return SuccessResponse.ok({
        res,
        message: "Email verified successfully.",
      });
    }
    throw new NotFoundException("User not found");
  };
  loginWithGmail = async (req: Request, res: Response): Promise<Response> => {
    const { idToken }: RegisterWithGmailDto = req.body || {};
    const { email }: Partial<TokenPayload> = await this.verifyGmailAccount({
      idToken,
    });

    const user = await this.userModel.findOne({
      email: email as string,
      provider: UserProviders.google,
    });

    if (!user)
      throw new NotFoundException("Email does not exist with google provider");

    const credentials = createLoginCredentials(user);

    return SuccessResponse.ok({
      res,
      message: "User logged in successfully",
      data: { credentials },
    });
  };
  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: LoginBodyDto = req.body || {};
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException("Invalid credentials");
    if (!user.confirmed)
      throw new BadRequestException(
        "Please verify your email before logging in"
      );
    const isPasswordValid = await compareHash({
      plainText: password as string,
      cipherText: user.password as string,
    });
    if (!isPasswordValid) throw new BadRequestException("Invalid credentials");

    // generate credentials
    const credentials = createLoginCredentials(user);
    return SuccessResponse.ok({
      res,
      message: "User logged in successfully",
      data: {
        credentials,
      },
    });
  };
  sendForgetPasswordCode = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { email }: SendForgetPasswordCodeDto = req.body || {};
    const user = await this.userModel.findOne({
      email,
      provider: UserProviders.system,
      confirmed: { $exists: true },
    });
    if (!user)
      throw new NotFoundException(
        "User not found due to one of the following reasons: [not registered, Invalid provider, not confirmed]"
      );
    const otp = otpGen();

    const result = await this.userModel.updateOne({
      filter: { email },
      update: {
        $set: { resetPasswordOtp: await hashText({ plainText: String(otp) }) },
      },
    });
    if (!result?.matchedCount)
      throw new BadRequestException(
        "Failed to send reset password otp, please try again later"
      );
    eventEmitter.emit("sendEmail", {
      from: `"${APP_NAME}" <${APP_EMAIL}>`,
      to: user.email,
      subject: "Reset Password",
      text: "otp for reset password",
      html: emailTemplates.sendEmailForResetPasswordOtp({
        otp,
        firstName: user.firstName,
      }),
    });
    return SuccessResponse.ok({
      res,
      message:
        "Otp Sent, please check your inbox for the otp, check your spams if you didn't get the email",
    });
  };
  resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp, password, confirmPassword }: ResetPasswordDto =
      req.body || {};
    if (password !== confirmPassword)
      throw new BadRequestException("confirmPassword does not match password");
    const user = await this.userModel.findOne({
      email,
      confirmed: { $exists: true },
      resetPasswordOtp: { $exists: true },
      provider: UserProviders.system,
    });
    if (!user)
      throw new NotFoundException(
        "User not found due to one of the following reasons: [not registered, Invalid provider, not confirmed,otp does not exist]"
      );
    if (
      !(await compareHash({
        plainText: String(otp),
        cipherText: user.resetPasswordOtp!,
      }))
    )
      throw new BadRequestException("Invalid Otp");

    const result = await this.userModel.updateOne({
      filter: { email: user.email },
      update: {
        $unset: { otp: "", resetPasswordOtp: "" },
        $set: {
          changeCredentialsAt: new Date(),

          password: await hashText({ plainText: password }),
        },
      },
    });
    if (!result.matchedCount)
      throw new BadRequestException(
        "Failed to reset password, please try again later"
      );

    eventEmitter.emit("sendEmail", {
      from: `"${APP_NAME}" <${APP_EMAIL}>`,
      to: user.email,
      subject: "Password Reset",
      text: "Password Reset Successfully",
      html: emailTemplates.passwordResetSuccessfullyEmail({
        firstName: user.firstName,
      }),
    });

    return SuccessResponse.ok({ res, message: "Password Reset Successfully" });
  };
  logout = async (req: Request, res: Response): Promise<Response> => {
    const { flag }: LogoutBodyDto = req.body || {};
    let statusCode: number = 200;
    const update: UpdateQuery<IUser> = {};
    switch (flag) {
      case LogoutEnum.all:
        update.changeCredentialsAt = new Date();

        break;

      default:
        await createRevokeToken({ decoded: req?.decoded as JwtPayload });
        statusCode = 201;
        break;
    }
    await this.userModel.updateOne({
      filter: { _id: req?.decoded?.id },
      update,
    });

    return statusCode === 201
      ? SuccessResponse.created({
          res,
          message:
            flag === LogoutEnum.only
              ? "Logged out successfully from this device"
              : "Logged out successfully from all devices",
        })
      : SuccessResponse.ok({
          res,
          message:
            flag === LogoutEnum.only
              ? "Logged out successfully from this device"
              : "Logged out successfully from all devices",
        });
  };
}
export default new AuthService();
