"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChattingGroupValidationSchema = exports.createChattingGroupValidationSchema = exports.getChatValidationSchema = void 0;
const zod_1 = require("zod");
const general_fields_1 = require("../../utils/general-fields");
const multer_1 = require("../../utils/multer");
exports.getChatValidationSchema = {
    params: zod_1.z.strictObject({
        userId: general_fields_1.generalFields.id,
    }),
    query: zod_1.z.strictObject({
        page: zod_1.z.coerce.number().int().min(1).optional(),
        size: zod_1.z.coerce.number().int().min(1).optional(),
    }),
};
exports.createChattingGroupValidationSchema = {
    body: zod_1.z.strictObject({
        participants: zod_1.z.array(general_fields_1.generalFields.id).min(1),
        groupName: zod_1.z.string().min(2).max(5000),
        attachment: general_fields_1.generalFields.file(multer_1.fileValidation.image),
    }).superRefine((data, ctx) => {
        if (data.participants?.length &&
            data.participants.length !== [...new Set(data.participants)].length) {
            ctx.addIssue({
                code: "custom",
                path: ["participants"],
                message: "Duplicate participants detected",
            });
        }
    })
};
exports.getChattingGroupValidationSchema = {
    params: zod_1.z.strictObject({
        groupId: general_fields_1.generalFields.id,
    }),
    query: exports.getChatValidationSchema.query,
};
