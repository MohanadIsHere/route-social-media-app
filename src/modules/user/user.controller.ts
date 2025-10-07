import { Router } from "express";
import { authentication } from "../../middlewares";
import UserService from "./user.service";
import { TokenEnum } from "../../utils/tokens";

const userRouter = Router();

userRouter.get("/me", authentication(), UserService.me);
userRouter.patch(
  "/profile-image",
  authentication(),
  // cloudFileUpload({
  //   validation: fileValidation.image,
  //   storageApproach: StorageApproachEnum.memory
  // }).single("image"),
  UserService.updateProfileImage
);

userRouter.post(
  "/refresh-token",
  authentication(TokenEnum.refresh),
  UserService.refreshToken
);

export default userRouter;
