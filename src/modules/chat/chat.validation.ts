import { z } from "zod";
import { generalFields } from "../../utils/general-fields";
import { fileValidation } from "../../utils/multer";
export const getChatValidationSchema = {
  params: z.strictObject({
    userId: generalFields.id,
  }),
  query: z.strictObject({
    page: z.coerce.number().int().min(1).optional(),
    size: z.coerce.number().int().min(1).optional(),
  }),
};
export const createChattingGroupValidationSchema = {
  body: z.strictObject({
    participants: z.array(generalFields.id).min(1),
    groupName: z.string().min(2).max(5000),
    attachment: generalFields.file(fileValidation.image),
  }).superRefine((data, ctx) => {
    if (
            data.participants?.length &&
            data.participants.length !== [...new Set(data.participants)].length
          ) {
            ctx.addIssue({
              code: "custom",
              path: ["participants"],
              message: "Duplicate participants detected",
            });
          }
  })
};
export const getChattingGroupValidationSchema = {
  params: z.strictObject({
    groupId: generalFields.id,
  }),
  query: getChatValidationSchema.query,
};