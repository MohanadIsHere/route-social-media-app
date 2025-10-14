"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePostValidationSchema = exports.updatePostValidationSchema = exports.createPostValidationSchema = void 0;
const zod_1 = require("zod");
const models_1 = require("../../database/models");
const general_fields_1 = require("../../utils/general-fields");
const multer_1 = require("../../utils/multer");
exports.createPostValidationSchema = {
    body: zod_1.z
        .strictObject({
        content: zod_1.z.string().min(3).max(500000).optional(),
        attachments: zod_1.z
            .array(general_fields_1.generalFields.file(multer_1.fileValidation.image))
            .max(2)
            .optional(),
        availability: zod_1.z.enum(models_1.AvailabilityEnum).default(models_1.AvailabilityEnum.public),
        allowComments: zod_1.z.enum(models_1.AllowCommentsEnum).default(models_1.AllowCommentsEnum.allow),
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
exports.updatePostValidationSchema = {
    params: zod_1.z.strictObject({
        postId: general_fields_1.generalFields.id,
    }),
    body: zod_1.z
        .strictObject({
        content: zod_1.z.string().min(3).max(500000).optional(),
        attachments: zod_1.z
            .array(general_fields_1.generalFields.file(multer_1.fileValidation.image))
            .max(2)
            .optional(),
        removedAttachments: zod_1.z.array(zod_1.z.string()).max(2).optional(),
        availability: zod_1.z.enum(models_1.AvailabilityEnum).optional(),
        allowComments: zod_1.z.enum(models_1.AllowCommentsEnum).optional(),
        tags: zod_1.z.array(general_fields_1.generalFields.id).max(10).optional(),
        removedTags: zod_1.z.array(general_fields_1.generalFields.id).max(10).optional(),
    })
        .superRefine((data, ctx) => {
        if (!Object.values(data)?.length) {
            ctx.addIssue({
                code: "custom",
                path: ["content"],
                message: "All fields cannot be empty",
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
        if (data.removedTags?.length &&
            data.removedTags.length !== [...new Set(data.removedTags)].length) {
            ctx.addIssue({
                code: "custom",
                path: ["removedTags"],
                message: "Duplicate removedTags detected",
            });
        }
    }),
};
exports.likePostValidationSchema = {
    query: zod_1.z.strictObject({
        action: zod_1.z.enum(models_1.LikeActionEnum).default(models_1.LikeActionEnum.like),
    }),
};
