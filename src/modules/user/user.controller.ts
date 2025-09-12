import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import UserService from "./user.service";
import { TokenEnum } from "../../utils/tokens";
import { cloudFileUpload, fileValidation, StorageApproachEnum } from "../../utils/multer/cloud.multer";

const userRouter = Router();

userRouter.get("/me", authentication(), UserService.me);
userRouter.patch("/profile-image", authentication(), cloudFileUpload({
  validation: fileValidation.image,
  storageApproach: StorageApproachEnum.disk
}).single("image"), UserService.updateProfileImage);

userRouter.post(
  "/refresh-token",
  authentication(TokenEnum.refresh),
  UserService.refreshToken
);

export default userRouter;
