"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = require("../../middlewares/authentication.middleware");
const user_service_1 = __importDefault(require("./user.service"));
const tokens_1 = require("../../utils/tokens");
const cloud_multer_1 = require("../../utils/multer/cloud.multer");
const userRouter = (0, express_1.Router)();
userRouter.get("/me", (0, authentication_middleware_1.authentication)(), user_service_1.default.me);
userRouter.patch("/profile-image", (0, authentication_middleware_1.authentication)(), (0, cloud_multer_1.cloudFileUpload)({
    validation: cloud_multer_1.fileValidation.image,
    storageApproach: cloud_multer_1.StorageApproachEnum.disk
}).single("image"), user_service_1.default.updateProfileImage);
userRouter.post("/refresh-token", (0, authentication_middleware_1.authentication)(tokens_1.TokenEnum.refresh), user_service_1.default.refreshToken);
exports.default = userRouter;
