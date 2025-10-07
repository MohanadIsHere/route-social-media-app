import { Router } from "express";
import AuthService from "./auth.service";
import { validation, authentication } from "../../middlewares";
import * as validators from "./auth.validation";

const authRouter = Router();

authRouter.post(
  "/register",
  validation(validators.RegisterSchema),
  AuthService.register
);
authRouter.post(
  "/register-gmail",
  validation(validators.RegisterWithGmailSchema),
  AuthService.registerWithGmail
);
authRouter.post(
  "/login-gmail",
  validation(validators.RegisterWithGmailSchema),
  AuthService.loginWithGmail
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
authRouter.patch(
  "/send-reset-password",
  validation(validators.SendForgetPasswordCodeSchema),
  AuthService.sendForgetPasswordCode
);
authRouter.patch(
  "/reset-password",
  validation(validators.ResetPasswordSchema),
  AuthService.resetPassword
);
export default authRouter;
