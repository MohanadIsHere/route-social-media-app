import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import UserService from "./user.service";
import { TokenEnum } from "../../utils/tokens";

const userRouter = Router();

userRouter.get("/me", authentication(), UserService.me);
userRouter.post(
  "/refresh-token",
  authentication(TokenEnum.refresh),
  UserService.refreshToken
);

export default userRouter;
