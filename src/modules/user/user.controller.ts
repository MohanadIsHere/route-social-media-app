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

export default userRouter;
