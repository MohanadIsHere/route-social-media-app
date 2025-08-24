"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = void 0;
const zod_1 = require("zod");
exports.generalFields = {
    username: zod_1.z
        .string({ error: "Invalid username" })
        .min(2, { message: "Username must be at least 2 characters long" })
        .max(100, { message: "Username must be at most 100 characters long" })
        .transform((val) => val.trim()),
    email: zod_1.z
        .email({ error: "Invalid email address" })
        .transform((val) => val.trim().toLowerCase()),
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
