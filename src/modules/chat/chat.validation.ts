import { z } from "zod";
import { generalFields } from "../../utils/general-fields";
export const getChatValidationSchema = {
  params : z.strictObject({
    userId: generalFields.id
  }),
  query: z.strictObject({
    page:z.coerce.number().int().min(1).optional(),
    size:z.coerce.number().int().min(1).optional(),
  }),
}