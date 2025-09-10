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
      role: generalFields.role.optional(),
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
    otp: z.string({ error: "Invalid OTP" }).length(6, "OTP must be 6 characters long"),
  }),
};
export const LogoutSchema = {
  body: z.strictObject({
    flag: z.enum(LogoutEnum).default(LogoutEnum.only).optional(),
  }),
};