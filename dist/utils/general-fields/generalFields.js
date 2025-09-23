"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = void 0;
const zod_1 = require("zod");
const user_model_1 = require("../../database/models/user.model");
exports.generalFields = {
    firstName: zod_1.z
        .string({ error: "Invalid first name" })
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(100, { message: "First name must be at most 100 characters long" })
        .transform((val) => val.trim()),
    middleName: zod_1.z
        .string({ error: "Invalid middle name" })
        .min(2, { message: "Middle name must be at least 2 characters long" })
        .max(100, { message: "Middle name must be at most 100 characters long" })
        .transform((val) => val.trim()),
    lastName: zod_1.z
        .string({ error: "Invalid last name" })
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(100, { message: "Last name must be at most 100 characters long" })
        .transform((val) => val.trim()),
    role: zod_1.z
        .nativeEnum(user_model_1.UserRoles, { error: () => ({ message: "Invalid role" }) })
        .transform((val) => typeof val === "string" ? val.trim().toLowerCase() : val),
    address: zod_1.z
        .string({ error: "Invalid address" })
        .min(5, { message: "Address must be at least 5 characters long" })
        .max(200, { message: "Address must be at most 200 characters long" })
        .transform((val) => val.trim()),
    username: zod_1.z
        .string({ error: "Invalid username" })
        .min(2, { message: "Username must be at least 2 characters long" })
        .max(100, { message: "Username must be at most 100 characters long" })
        .transform((val) => val.trim()),
    email: zod_1.z
        .email({ error: "Invalid email address" })
        .transform((val) => val.trim().toLowerCase()),
    phone: zod_1.z
        .string({ error: "Invalid phone number" })
        .min(10, { message: "Phone number must be at least 10 characters long" })
        .max(15, { message: "Phone number must be at most 15 characters long" })
        .regex(/^\+?[1-9]\d{1,14}$/, {
        message: "Phone number must be a valid international format",
    }),
    password: zod_1.z
        .string({ error: "Invalid password" })
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must be at most 100 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-z])(?=.*\d)(?=.*[^a-zA-z\d]).{8,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    })
        .transform((val) => val.trim()),
    confirmPassword: zod_1.z
        .string({ error: "Invalid confirm password" })
        .transform((val) => val.trim()),
    otp: zod_1.z
        .string({ error: "Invalid OTP" })
        .length(6, "OTP must be 6 characters long"),
    profilePicture: zod_1.z.url({ error: "Invalid profile picture URL" }),
};
