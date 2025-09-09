import { Router } from "express";
import authService from "./auth.service";
import { validation } from "../../middlewares/validation.middleware";
import {
  LoginSchema,
  RegisterSchema,
  VerifyEmailSchema,
} from "./auth.validation";

const authRouter = Router();

authRouter.post("/register", validation(RegisterSchema), authService.register);
authRouter.patch(
  "/verify-email",
  validation(VerifyEmailSchema),
  authService.verifyEmail
);
authRouter.post("/login", validation(LoginSchema), authService.login);

export default authRouter;
