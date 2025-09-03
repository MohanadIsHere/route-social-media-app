import type { Request, Response } from "express";
import { IUser, User } from "../../database/models/user.model";
import { UserRepository } from "../../database/repository/user.repository";
import {
  BadRequestException,
  emailTemplates,
  eventEmitter,
  NotFoundException,
  otpGen,
} from "../../utils";
import { APP_EMAIL, APP_NAME } from "../../config/env";

class AuthService {
  private userModel = new UserRepository(User);
  constructor() {}

  register = async (req: Request, res: Response): Promise<Response> => {
    const otp = otpGen;
    const user = await this.userModel.createUser({
      data: { ...req.body, otp } as Partial<IUser>,
    });

    eventEmitter.emit("sendEmail", {
      from: `"${APP_NAME}" <${APP_EMAIL}>`,
      to: user.email,
      subject: "Email Verification",
      text: "Please verify your email address.",
      html: emailTemplates.confirmEmail({
        otp,
        firstName: user.firstName,
        link: `${req.protocol}://${req.get("host")}/api/auth/verify-email`,
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
    console.log({user});
    
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

  login = (req: Request, res: Response) => {};
}

export default new AuthService();
