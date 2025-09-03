"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = void 0;
const zod_1 = require("zod");
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
};
