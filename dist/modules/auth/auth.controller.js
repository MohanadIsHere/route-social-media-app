"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_validation_1 = require("./auth.validation");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", (0, validation_middleware_1.validation)(auth_validation_1.RegisterSchema), auth_service_1.default.register);
authRouter.patch("/verify-email", (0, validation_middleware_1.validation)(auth_validation_1.VerifyEmailSchema), auth_service_1.default.verifyEmail);
authRouter.post("/login", (0, validation_middleware_1.validation)(auth_validation_1.LoginSchema), auth_service_1.default.login);
exports.default = authRouter;
