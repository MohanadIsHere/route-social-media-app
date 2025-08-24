"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
const general_fields_1 = require("../../utils/general-fields");
exports.LoginSchema = {
    body: zod_1.z
        .strictObject({
        email: general_fields_1.generalFields.email,
        password: general_fields_1.generalFields.password,
    }),
};
exports.RegisterSchema = {
    body: exports.LoginSchema.body.extend({
        username: general_fields_1.generalFields.username,
        confirmPassword: general_fields_1.generalFields.confirmPassword,
    })
        .refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match the confirm password",
        path: ["confirmPassword"],
    }),
};
