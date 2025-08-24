import { z } from "zod";

export const RegisterSchema = {
  body: z
    .strictObject({
      username: z
        .string({ error: "Invalid username" })
        .min(2, { message: "Username must be at least 2 characters long" })
        .max(100, { message: "Username must be at most 100 characters long" })
        .transform((val) => val.trim()),
      email: z
        .email({ error: "Invalid email address" })
        .transform((val) => val.trim().toLowerCase()),
      password: z
        .string({ error: "Invalid password" })
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must be at most 100 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        })
        .transform((val) => val.trim()),
      confirmPassword: z
        .string({ error: "Invalid confirm password" })
        .transform((val) => val.trim()),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match confirm password",
      path: ["confirmPassword"],
    }),
};
