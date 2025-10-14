"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../../utils/tokens");
const models_1 = require("../../database/models");
const response_1 = require("../../utils/response");
const S3_1 = require("../../utils/aws/S3");
const repository_1 = require("../../database/repository");
const events_1 = require("../../utils/events");
const env_1 = require("../../config/env");
class UserService {
    userModel = new repository_1.UserRepository(models_1.User);
    constructor() { }
    me = (req, res, next) => {
        return (0, response_1.successResponse)({
            res,
            message: "User Retrieved Successfully",
            data: { user: req.user, decoded: req.decoded },
        });
    };
    refreshToken = async (req, res) => {
        const credentials = (0, tokens_1.createLoginCredentials)(req.user);
        await (0, tokens_1.createRevokeToken)({ decoded: req?.decoded });
        return (0, response_1.successResponse)({
            res,
            message: "Token refreshed successfully",
            data: {
                credentials,
            },
        });
    };
    updateProfileImage = async (req, res) => {
        const { ContentType, originalname, } = req.body;
        const { url, key } = await (0, S3_1.createPreSignedUrl)({
            ContentType,
            originalname,
            path: `users/${req.decoded?.id}`,
        });
        const user = await this.userModel.findOneAndUpdate({
            filter: {
                _id: req.user?._id
            },
            update: { profileImage: key, tmpProfileImage: req.user?.profileImage },
        });
        if (!user)
            throw new response_1.NotFoundException("User not found");
        events_1.s3Events.emit("trackProfileImageUpload", {
            userId: req.user?._id,
            oldImageKey: req.user?.profileImage,
            newImageKey: key,
            expiresIn: Number(env_1.AWS_PRE_SIGNED_URL_EXPIRES_IN) * 1000,
        });
        return (0, response_1.successResponse)({
            res,
            data: { key, url },
            message: "Pre signed URL created successfully",
        });
    };
}
exports.default = new UserService();
