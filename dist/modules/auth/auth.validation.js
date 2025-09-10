"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutSchema = exports.VerifyEmailSchema = exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
const general_fields_1 = require("../../utils/general-fields");
const tokens_1 = require("../../utils/tokens");
exports.LoginSchema = {
    body: zod_1.z.strictObject({
        email: general_fields_1.generalFields.email,
        password: general_fields_1.generalFields.password,
    }),
};
exports.RegisterSchema = {
    body: exports.LoginSchema.body
        .extend({
        firstName: general_fields_1.generalFields.firstName,
        middleName: general_fields_1.generalFields.middleName.optional(),
        phone: general_fields_1.generalFields.phone.optional(),
        lastName: general_fields_1.generalFields.lastName,
        address: general_fields_1.generalFields.address.optional(),
        role: general_fields_1.generalFields.role.optional(),
        confirmPassword: general_fields_1.generalFields.confirmPassword,
    })
        .refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match the confirm password",
        path: ["confirmPassword"],
    }),
};
exports.VerifyEmailSchema = {
    body: zod_1.z.strictObject({
        email: general_fields_1.generalFields.email,
        otp: zod_1.z.string({ error: "Invalid OTP" }).length(6, "OTP must be 6 characters long"),
    }),
};
exports.LogoutSchema = {
    body: zod_1.z.strictObject({
        flag: zod_1.z.enum(tokens_1.LogoutEnum).default(tokens_1.LogoutEnum.only).optional(),
    }),
};
