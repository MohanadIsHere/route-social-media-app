import { Router } from "express";
import AuthService from "./auth.service";
import { validation } from "../../middlewares/validation.middleware";
import * as validators from "./auth.validation";
import { authentication } from "../../middlewares/authentication.middleware";

const authRouter = Router();

authRouter.post(
  "/register",
  validation(validators.RegisterSchema),
  AuthService.register
);
authRouter.patch(
  "/verify-email",
  validation(validators.VerifyEmailSchema),
  AuthService.verifyEmail
);
authRouter.post(
  "/login",
  validation(validators.LoginSchema),
  AuthService.login
);
authRouter.post(
  "/logout",
  validation(validators.LogoutSchema),
  authentication(),
  AuthService.logout
);
export default authRouter;
