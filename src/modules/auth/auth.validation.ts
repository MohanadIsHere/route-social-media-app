import { z } from "zod";
import { generalFields } from "../../utils/general-fields";
import { LogoutEnum } from "../../utils/tokens";

export const LoginSchema = {
  body: z.strictObject({
    email: generalFields.email,
    password: generalFields.password,
  }),
};
export const RegisterSchema = {
  body: LoginSchema.body
    .extend({
      firstName: generalFields.firstName,
      middleName: generalFields.middleName.optional(),
      phone: generalFields.phone.optional(),
      lastName: generalFields.lastName,
      address: generalFields.address.optional(),
      confirmPassword: generalFields.confirmPassword,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password do not match the confirm password",
      path: ["confirmPassword"],
    }),
};
export const VerifyEmailSchema = {
  body: z.strictObject({
    email: generalFields.email,
    otp: generalFields.otp,
  }),
};
export const LogoutSchema = {
  body: z.strictObject({
    flag: z.enum(LogoutEnum).default(LogoutEnum.only).optional(),
  }),
};
export const RegisterWithGmailSchema = {
  body: z.strictObject({
    idToken: z.string({ error: "Invalid Token" }),
  }),
};
export const SendForgetPasswordCodeSchema = {
  body: z.strictObject({
    email: generalFields.email,
  }),
};
export const ResetPasswordSchema = {
  body: z.strictObject({
    email: generalFields.email,
    otp: generalFields.otp,
    password: generalFields.password,
    confirmPassword: generalFields.confirmPassword,
  }),
};
