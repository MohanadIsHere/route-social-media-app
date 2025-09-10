import { Router } from "express";
import authService from "./auth.service";
import { validation } from "../../middlewares/validation.middleware";
import * as validators from "./auth.validation";
import { authentication } from "../../middlewares/authentication.middleware";

const authRouter = Router();

authRouter.post(
  "/register",
  validation(validators.RegisterSchema),
  authService.register
);
authRouter.patch(
  "/verify-email",
  validation(validators.VerifyEmailSchema),
  authService.verifyEmail
);
authRouter.post(
  "/login",
  validation(validators.LoginSchema),
  authService.login
);
authRouter.post(
  "/logout",
  validation(validators.LogoutSchema),
  authentication(),
  authService.logout
);

export default authRouter;
