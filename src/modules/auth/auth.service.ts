import type { Request, Response } from "express";
import { IUser, User } from "../../database/models/user.model";
import { UserRepository } from "../../database/repository/user.repository";
import {
  BadRequestException,
  compareHash,
  createLoginCredentials,
  emailTemplates,
  encryptText,
  eventEmitter,
  generateToken,
  hashText,
  NotFoundException,
  otpGen,
} from "../../utils";
import {
  APP_EMAIL,
  APP_NAME,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_USER_SECRET,
} from "../../config/env";
import { LoginBodyDto, RegisterBodyDto } from "./dto";

class AuthService {
  private userModel = new UserRepository(User);
  constructor() {}

  register = async (req: Request, res: Response): Promise<Response> => {
    const { password, phone }: RegisterBodyDto = req.body || {};
    const otp = otpGen();
    const hashed = await hashText({
      plainText: password as string,
    });
    let encryptedPhone: string | undefined = undefined;
    if (phone) {
      encryptedPhone = encryptText({ cipherText: phone as string });
    }

    const user = await this.userModel.createUser({
      data: {
        ...req.body,
        otp,
        phone: encryptedPhone,
        password: hashed,
      } as Partial<IUser>,
    });

    eventEmitter.emit("sendEmail", {
      from: `"${APP_NAME}" <${APP_EMAIL}>`,
      to: user.email,
      subject: "Email Verification",
      text: "Please verify your email address.",
      html: emailTemplates.verifyEmail({
        otp,
        firstName: user.firstName,
      }),
    });

    return res.status(201).json({
      message:
        "User registered successfully, please check your email for verification.",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          address: user.address ? user.address : undefined,
          gender: user.gender,
          phone: user.phone ? user.phone : undefined,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
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
      if (user.otp !== otp) throw new BadRequestException("Invalid OTP");
      await this.userModel.update({
        filter: { email },
        update: {
          $set: { confirmed: true },
          $unset: { otp: "" },
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
      return res.status(200).json({
        message: "Email verified successfully.",
      });
    }
    throw new NotFoundException("User not found");
  };

  login = async (req: Request, res: Response) => {
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

    // generate tokens
    const credentials = createLoginCredentials(user)
    return res.status(200).json({
      message: "Login successful",
      data: {
        credentials,
      },
    });
  };
}

export default new AuthService();
