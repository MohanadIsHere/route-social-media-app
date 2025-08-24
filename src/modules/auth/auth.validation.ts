import { z } from "zod";
import { generalFields } from "../../utils/general-fields";

export const LoginSchema = {
  body: z
    .strictObject({
      email: generalFields.email,
      password: generalFields.password,
    }),
};
export const RegisterSchema = {
  body: LoginSchema.body.extend({
    username: generalFields.username,
    confirmPassword: generalFields.confirmPassword,
  })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password do not match the confirm password",
      path: ["confirmPassword"],
    }),
};
