"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostValidationSchema = void 0;
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
