"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = require("../../middlewares/authentication.middleware");
const user_service_1 = __importDefault(require("./user.service"));
const userRouter = (0, express_1.Router)();
userRouter.get("/me", (0, authentication_middleware_1.authentication)(), user_service_1.default.me);
exports.default = userRouter;
