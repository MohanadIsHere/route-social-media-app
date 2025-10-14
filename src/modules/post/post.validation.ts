import { z } from "zod";
import { AllowCommentsEnum, AvailabilityEnum, LikeActionEnum } from "../../database/models";
import { generalFields } from "../../utils/general-fields";
import { fileValidation } from "../../utils/multer";
export const createPostValidationSchema = {
  body: z
    .strictObject({
      content: z.string().min(3).max(500000).optional(),
      attachments: z
        .array(generalFields.file(fileValidation.image))
        .max(2)
        .optional(),
      availability: z.enum(AvailabilityEnum).default(AvailabilityEnum.public),
      allowComments: z.enum(AllowCommentsEnum).default(AllowCommentsEnum.allow),
      tags: z.array(generalFields.id).max(10).optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.attachments?.length && !data.content) {
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message: "Either content or attachments is required",
        });
      }
      if (
        data.tags?.length &&
        data.tags.length !== [...new Set(data.tags)].length
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["tags"],
          message: "Duplicate tags detected",
        });
      }
    }),
};
export const likePostValidationSchema = {
  query: z.strictObject({
    action: z.enum(LikeActionEnum).default(LikeActionEnum.like)
  })
}