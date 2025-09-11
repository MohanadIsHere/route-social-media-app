import type { Request, Response } from "express";
import {  type IUser, User } from "../../database/models/user.model";
import { UserRepository } from "../../database/repository/user.repository";

import {
  APP_EMAIL,
  APP_NAME,
} from "../../config/env";
import type { LoginBodyDto, LogoutBodyDto, RegisterBodyDto } from "./dto";
import { eventEmitter, otpGen } from "../../utils/events";
import { compareHash, hashText } from "../../utils/security/hash";
import { encryptText } from "../../utils/security/encryption";
import { emailTemplates } from "../../utils/templates";
import { BadRequestException, NotFoundException } from "../../utils/response";
import { createLoginCredentials, createRevokeToken, LogoutEnum } from "../../utils/tokens";
import type { UpdateQuery } from "mongoose";
import { TokenRepository } from "../../database/repository/token.repository";
import { Token } from "../../database/models/token.model";
import type{ JwtPayload } from "jsonwebtoken";

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
      await this.userModel.updateOne({
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
    return res.status(200).json({
      message: "User logged in successfully",
      data: {
        credentials,
      },
    });
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

    return res.status(statusCode).json({
      message:
        flag === LogoutEnum.only
          ? "Logged out successfully from this device"
          : "Logged out successfully from all devices",
    });
  };
  
}

export default new AuthService();
