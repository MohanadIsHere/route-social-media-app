import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import UserService from "./user.service";

const userRouter = Router();

userRouter.get("/me", authentication(), UserService.me);

export default userRouter;
