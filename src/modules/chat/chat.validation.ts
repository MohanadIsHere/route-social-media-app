import { z } from "zod";
import { generalFields } from "../../utils/general-fields";
export const getChatValidationSchema = {
  params : z.strictObject({
    userId: generalFields.id
  })
}