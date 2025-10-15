import { z } from "zod";
import { generalFields } from "../../utils/general-fields";
import { UserRoles } from "../../database/models";
export const changeRoleValidationSchema = {
  params: z.strictObject({
    userId: generalFields.id,
  }),
  body: z.strictObject({
    role: z.enum(UserRoles),
  }),
};
export const sendFriendRequestValidationSchema = {
  params: changeRoleValidationSchema.params,
};
export const acceptFriendRequestValidationSchema = {
  params: z.strictObject({
    requestId: generalFields.id,
  }),
};
export const rejectFriendRequestValidationSchema = {
  params: acceptFriendRequestValidationSchema.params,
};
