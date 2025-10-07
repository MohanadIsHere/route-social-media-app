"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const user_service_1 = __importDefault(require("./user.service"));
const tokens_1 = require("../../utils/tokens");
const userRouter = (0, express_1.Router)();
userRouter.get("/me", (0, middlewares_1.authentication)(), user_service_1.default.me);
userRouter.patch("/profile-image", (0, middlewares_1.authentication)(), user_service_1.default.updateProfileImage);
userRouter.post("/refresh-token", (0, middlewares_1.authentication)(tokens_1.TokenEnum.refresh), user_service_1.default.refreshToken);
exports.default = userRouter;
