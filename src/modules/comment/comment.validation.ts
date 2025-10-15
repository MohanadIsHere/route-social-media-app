import { z } from "zod";

import { generalFields } from "../../utils/general-fields";
import { fileValidation } from "../../utils/multer";
import { LikeActionEnum } from "../../database/models";
export const createCommentValidationSchema = {
  params:z.strictObject({
    postId:generalFields.id
  }),
  body: z
    .strictObject({
      content: z.string().min(3).max(500000).optional(),
      attachments: z
        .array(generalFields.file(fileValidation.image))
        .max(2)
        .optional(),
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
export const replyOnCommentValidationSchema = {
  params: createCommentValidationSchema.params.extend({
    commentId: generalFields.id,
  }),
  body: createCommentValidationSchema.body,
};
export const likeCommentValidationSchema = {
  params: z.strictObject({
    postId: generalFields.id,
    commentId: generalFields.id,
  }),
  query: z.strictObject({
    action: z.enum(LikeActionEnum).default(LikeActionEnum.like),
  }),
};