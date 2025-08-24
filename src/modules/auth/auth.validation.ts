import { z } from "zod";

export const RegisterSchema = {
  body: z
    .strictObject({
      username: z
        .string({ error: "Invalid username" })
        .min(2, { message: "Username must be at least 2 characters long" })
        .max(100, { message: "Username must be at most 100 characters long" }),
      email: z.email({ error: "Invalid email address" }),
      password: z
        .string({ error: "Invalid password" })
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must be at most 100 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }),
      confirmPassword: z.string({ error: "Invalid confirm password" }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords do not match confirm password",
          path: ["confirmPassword"],
        });
      }
      if (data.username.split(" ").length < 2) {
        ctx.addIssue({
          code: "custom",
          message:
            "Username must be at least two words for example: 'John Doe'",
          path: ["username"],
        });
      }
    }),
  // .refine((data) => data.password === data.confirmPassword, {
  //   message: "Passwords do not match confirm password",
  //   path: ["confirmPassword"],
  // }),
};
