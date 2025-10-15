"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyOnCommentValidationSchema = exports.createCommentValidationSchema = void 0;
const zod_1 = require("zod");
const general_fields_1 = require("../../utils/general-fields");
const multer_1 = require("../../utils/multer");
exports.createCommentValidationSchema = {
    params: zod_1.z.strictObject({
        postId: general_fields_1.generalFields.id
    }),
    body: zod_1.z
        .strictObject({
        content: zod_1.z.string().min(3).max(500000).optional(),
        attachments: zod_1.z
            .array(general_fields_1.generalFields.file(multer_1.fileValidation.image))
            .max(2)
            .optional(),
        tags: zod_1.z.array(general_fields_1.generalFields.id).max(10).optional(),
    })
        .superRefine((data, ctx) => {
        if (!data.attachments?.length && !data.content) {
            ctx.addIssue({
                code: "custom",
                path: ["content"],
                message: "Either content or attachments is required",
            });
        }
        if (data.tags?.length &&
            data.tags.length !== [...new Set(data.tags)].length) {
            ctx.addIssue({
                code: "custom",
                path: ["tags"],
                message: "Duplicate tags detected",
            });
        }
    }),
};
exports.replyOnCommentValidationSchema = {
    params: exports.createCommentValidationSchema.params.extend({
        commentId: general_fields_1.generalFields.id,
    }),
    body: exports.createCommentValidationSchema.body,
};
