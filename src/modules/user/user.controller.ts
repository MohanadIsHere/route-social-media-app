import { Router } from "express";
import { authentication, validation } from "../../middlewares";
import userService from "./user.service";
import { TokenEnum } from "../../utils/tokens";
import { authorization, endpoint } from "../../middlewares";
import * as validators from "./user.validation"

const userRouter = Router();

userRouter.get("/me", authentication(), userService.me);
userRouter.patch(
  "/profile-image",
  authentication(),
  // cloudFileUpload({
  //   validation: fileValidation.image,
  //   storageApproach: StorageApproachEnum.memory
  // }).single("image"),
  userService.updateProfileImage
);
userRouter.get(
  "/dashboard",
  authorization(endpoint.dashboard),
  userService.dashboard
);
userRouter.patch(
  "/:userId/change-role",
  authorization(endpoint.dashboard),
  validation(validators.changeRoleValidationSchema),
  userService.changeRole
);
userRouter.post(
  "/refresh-token",
  authentication(TokenEnum.refresh),
  userService.refreshToken
);
userRouter.post(
  "/:userId/send-friend-request",
  authentication(),
  validation(validators.sendFriendRequestValidationSchema),

  userService.sendFriendRequest
);
userRouter.patch(
  "/accept-friend-request/:requestId",
  authentication(),
  validation(validators.acceptFriendRequestValidationSchema),

  userService.acceptFriendRequest
);
userRouter.patch(
  "/reject-friend-request/:requestId",
  authentication(),
  validation(validators.rejectFriendRequestValidationSchema),

  userService.rejectFriendRequest
);
export default userRouter;
