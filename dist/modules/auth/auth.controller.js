"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const middlewares_1 = require("../../middlewares");
const validators = __importStar(require("./auth.validation"));
const authRouter = (0, express_1.Router)();
authRouter.post("/register", (0, middlewares_1.validation)(validators.RegisterSchema), auth_service_1.default.register);
authRouter.post("/register-gmail", (0, middlewares_1.validation)(validators.RegisterWithGmailSchema), auth_service_1.default.registerWithGmail);
authRouter.post("/login-gmail", (0, middlewares_1.validation)(validators.RegisterWithGmailSchema), auth_service_1.default.loginWithGmail);
authRouter.patch("/verify-email", (0, middlewares_1.validation)(validators.VerifyEmailSchema), auth_service_1.default.verifyEmail);
authRouter.post("/login", (0, middlewares_1.validation)(validators.LoginSchema), auth_service_1.default.login);
authRouter.post("/logout", (0, middlewares_1.validation)(validators.LogoutSchema), (0, middlewares_1.authentication)(), auth_service_1.default.logout);
authRouter.patch("/send-reset-password", (0, middlewares_1.validation)(validators.SendForgetPasswordCodeSchema), auth_service_1.default.sendForgetPasswordCode);
authRouter.patch("/reset-password", (0, middlewares_1.validation)(validators.ResetPasswordSchema), auth_service_1.default.resetPassword);
exports.default = authRouter;
