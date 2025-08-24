import { Router } from "express";
import authService from "./auth.service";
import { validation } from "../../middlewares/validation.middleware";
import { RegisterSchema } from "./auth.validation";

const authRouter = Router();

authRouter.post("/register", validation(RegisterSchema),authService.register);

authRouter.post("/login", authService.login);

export default authRouter;
