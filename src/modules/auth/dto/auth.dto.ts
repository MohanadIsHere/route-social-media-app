import { z } from "zod";
import * as validators from "../auth.validation";

export type RegisterBodyDto = z.infer<typeof validators.RegisterSchema.body>;
export type RegisterWithGmailDto = z.infer<typeof validators.RegisterWithGmailSchema.body>;
export type SendForgetPasswordCodeDto = z.infer<
  typeof validators.SendForgetPasswordCodeSchema.body
>;
export type LoginBodyDto = z.infer<typeof validators.LoginSchema.body>;
export type ResetPasswordDto = z.infer<typeof validators.ResetPasswordSchema.body>;

export type LogoutBodyDto = z.infer<typeof validators.LogoutSchema.body>;
