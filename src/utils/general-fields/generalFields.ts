import { z } from "zod";
import { UserRoles } from "../../database/models/user.model";
export const generalFields = {
  firstName: z
    .string({ error: "Invalid first name" })
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(100, { message: "First name must be at most 100 characters long" })
    .transform((val) => val.trim()),
  middleName: z
    .string({ error: "Invalid middle name" })
    .min(2, { message: "Middle name must be at least 2 characters long" })
    .max(100, { message: "Middle name must be at most 100 characters long" })
    .transform((val) => val.trim()),
  lastName: z
    .string({ error: "Invalid last name" })
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(100, { message: "Last name must be at most 100 characters long" })
    .transform((val) => val.trim()),
    role: z
    .nativeEnum(UserRoles, { error: () => ({ message: "Invalid role" }) })
    .transform((val) => (typeof val === "string" ? val.trim().toLowerCase() : val)),
    address: z
    .string({ error: "Invalid address" })
    .min(5, { message: "Address must be at least 5 characters long" })
    .max(200, { message: "Address must be at most 200 characters long" })
    .transform((val) => val.trim()),
  username: z
    .string({ error: "Invalid username" })
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(100, { message: "Username must be at most 100 characters long" })
    .transform((val) => val.trim()),
  email: z
    .email({ error: "Invalid email address" })
    .transform((val) => val.trim().toLowerCase()),
  phone: z
    .string({ error: "Invalid phone number" })
    .min(10, { message: "Phone number must be at least 10 characters long" })
    .max(15, { message: "Phone number must be at most 15 characters long" })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Phone number must be a valid international format",
    }),
  password: z
    .string({ error: "Invalid password" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-z])(?=.*\d)(?=.*[^a-zA-z\d]).{8,}$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    })
    .transform((val) => val.trim()),
  confirmPassword: z
    .string({ error: "Invalid confirm password" })
    .transform((val) => val.trim()),
};
