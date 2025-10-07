"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = void 0;
const zod_1 = require("zod");
const models_1 = require("../../database/models");
const mongoose_1 = require("mongoose");
exports.generalFields = {
    id: zod_1.z.string().refine((data) => {
        return mongoose_1.Types.ObjectId.isValid(data);
    }, { message: "Invalid tag ID" }),
    file: function (mimetype) {
        return zod_1.z
            .strictObject({
            fieldname: zod_1.z.string(),
            originalname: zod_1.z.string(),
            encoding: zod_1.z.string(),
            mimetype: zod_1.z.enum(mimetype, {
                error: `File type must be one of: ${mimetype.join(", ")}}`,
            }),
            size: zod_1.z.number(),
            buffer: zod_1.z.any().optional(),
            path: zod_1.z.string().optional(),
        })
            .refine((data) => data.buffer || data.path, {
            message: "File must have either buffer or path",
            path: ["file"],
        });
    },
    firstName: zod_1.z
        .string({ message: "Invalid first name" })
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(100, { message: "First name must be at most 100 characters long" })
        .transform((val) => val.trim()),
    middleName: zod_1.z
        .string({ message: "Invalid middle name" })
        .min(2, { message: "Middle name must be at least 2 characters long" })
        .max(100, { message: "Middle name must be at most 100 characters long" })
        .transform((val) => val.trim()),
    lastName: zod_1.z
        .string({ message: "Invalid last name" })
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(100, { message: "Last name must be at most 100 characters long" })
        .transform((val) => val.trim()),
    role: zod_1.z
        .nativeEnum(models_1.UserRoles, { message: "Invalid role" })
        .transform((val) => typeof val === "string" ? val.trim().toLowerCase() : val),
    address: zod_1.z
        .string({ message: "Invalid address" })
        .min(5, { message: "Address must be at least 5 characters long" })
        .max(200, { message: "Address must be at most 200 characters long" })
        .transform((val) => val.trim()),
    username: zod_1.z
        .string({ message: "Invalid username" })
        .min(2, { message: "Username must be at least 2 characters long" })
        .max(100, { message: "Username must be at most 100 characters long" })
        .transform((val) => val.trim()),
    email: zod_1.z
        .string({ message: "Invalid email address" })
        .email()
        .transform((val) => val.trim().toLowerCase()),
    phone: zod_1.z
        .string({ message: "Invalid phone number" })
        .min(10, { message: "Phone number must be at least 10 characters long" })
        .max(15, { message: "Phone number must be at most 15 characters long" })
        .regex(/^\+?[1-9]\d{1,14}$/, {
        message: "Phone number must be a valid international format",
    }),
    password: zod_1.z
        .string({ message: "Invalid password" })
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must be at most 100 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
        message: "Password must contain at least one uppercase, one lowercase, one number, and one special character",
    })
        .transform((val) => val.trim()),
    confirmPassword: zod_1.z
        .string({ message: "Invalid confirm password" })
        .transform((val) => val.trim()),
    otp: zod_1.z
        .string({ message: "Invalid OTP" })
        .length(6, { message: "OTP must be 6 characters long" }),
    profilePicture: zod_1.z.string({ message: "Invalid profile picture URL" }).url(),
};
