"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../../utils/tokens");
const response_1 = require("../../utils/response");
const S3_1 = require("../../utils/aws/S3");
class UserService {
    constructor() { }
    me = (req, res, next) => {
        return response_1.SuccessResponse.ok({
            res,
            message: "User Retrieved Successfully",
            data: { user: req.user, decoded: req.decoded },
        });
    };
    refreshToken = async (req, res) => {
        const credentials = (0, tokens_1.createLoginCredentials)(req.user);
        await (0, tokens_1.createRevokeToken)({ decoded: req?.decoded });
        return response_1.SuccessResponse.created({
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
        return response_1.SuccessResponse.ok({
            res,
            data: { key, url },
            message: "Image uploaded successfully",
        });
    };
}
exports.default = new UserService();
