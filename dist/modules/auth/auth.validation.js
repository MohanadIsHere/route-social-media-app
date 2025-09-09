"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailSchema = exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
exports.LoginSchema = {
    body: zod_1.z.strictObject({
        email: utils_1.generalFields.email,
        password: utils_1.generalFields.password,
    }),
};
exports.RegisterSchema = {
    body: exports.LoginSchema.body
        .extend({
        firstName: utils_1.generalFields.firstName,
        middleName: utils_1.generalFields.middleName.optional(),
        phone: utils_1.generalFields.phone.optional(),
        lastName: utils_1.generalFields.lastName,
        address: utils_1.generalFields.address.optional(),
        role: utils_1.generalFields.role.optional(),
        confirmPassword: utils_1.generalFields.confirmPassword,
    })
        .refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match the confirm password",
        path: ["confirmPassword"],
    }),
};
exports.VerifyEmailSchema = {
    body: zod_1.z.strictObject({
        email: utils_1.generalFields.email,
        otp: zod_1.z.string({ error: "Invalid OTP" }).length(6, "OTP must be 6 characters long"),
    }),
};
