"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../../utils/tokens");
class UserService {
    constructor() { }
    me = (req, res, next) => {
        return res.status(200).json({
            message: "User Retrieved Successfully",
            data: { user: req.user, decoded: req.decoded },
        });
    };
    refreshToken = async (req, res) => {
        const credentials = (0, tokens_1.createLoginCredentials)(req.user);
        await (0, tokens_1.createRevokeToken)({ decoded: req?.decoded });
        return res.status(201).json({
            message: "Token refreshed successfully",
            data: {
                credentials,
            },
        });
    };
}
exports.default = new UserService();
