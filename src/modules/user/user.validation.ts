import {z}from "zod"
import { generalFields } from "../../utils/general-fields";
import { UserRoles } from "../../database/models";
export const changeRoleValidationSchema = {
  params:z.strictObject({
    userId: generalFields.id
  }),
  body: z.strictObject({
    role: z.enum(UserRoles)
  })
};