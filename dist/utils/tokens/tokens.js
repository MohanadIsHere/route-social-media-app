"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.createLoginCredentials = exports.getSignatures = exports.detectSignatureLevel = exports.verifyToken = exports.generateToken = exports.LogoutEnum = exports.TokenEnum = exports.SignatureLevelsEnum = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
const env_1 = require("../../config/env");
const user_model_1 = require("../../database/models/user.model");
const response_1 = require("../response");
const user_repository_1 = require("../../database/repository/user.repository");
const token_repository_1 = require("../../database/repository/token.repository");
const token_model_1 = require("../../database/models/token.model");
const userModel = new user_repository_1.UserRepository(user_model_1.User);
const tokenModel = new token_repository_1.TokenRepository(token_model_1.Token);
var SignatureLevelsEnum;
(function (SignatureLevelsEnum) {
    SignatureLevelsEnum["Bearer"] = "Bearer";
    SignatureLevelsEnum["System"] = "System";
})(SignatureLevelsEnum || (exports.SignatureLevelsEnum = SignatureLevelsEnum = {}));
var TokenEnum;
(function (TokenEnum) {
    TokenEnum["access"] = "access";
    TokenEnum["refresh"] = "refresh";
})(TokenEnum || (exports.TokenEnum = TokenEnum = {}));
var LogoutEnum;
(function (LogoutEnum) {
    LogoutEnum["only"] = "only";
    LogoutEnum["all"] = "all";
})(LogoutEnum || (exports.LogoutEnum = LogoutEnum = {}));
const generateToken = ({ payload, secret = env_1.ACCESS_TOKEN_USER_SECRET, options = { expiresIn: Number(env_1.ACCESS_TOKEN_EXPIRES_IN) }, }) => {
    return (0, jsonwebtoken_1.sign)({ ...payload }, secret, options);
};
exports.generateToken = generateToken;
const verifyToken = ({ token, secret = env_1.ACCESS_TOKEN_USER_SECRET, }) => {
    return (0, jsonwebtoken_1.verify)(token, secret);
};
exports.verifyToken = verifyToken;
const detectSignatureLevel = (role = user_model_1.UserRoles.user) => {
    let signatureLevel = SignatureLevelsEnum.Bearer;
    switch (role) {
        case user_model_1.UserRoles.admin:
            signatureLevel = SignatureLevelsEnum.System;
            break;
        default:
            signatureLevel = SignatureLevelsEnum.Bearer;
            break;
    }
    return signatureLevel;
};
exports.detectSignatureLevel = detectSignatureLevel;
const getSignatures = (signatureLevel = SignatureLevelsEnum.Bearer) => {
    let signatures = {
        access_signature: "",
        refresh_signature: "",
    };
    switch (signatureLevel) {
        case SignatureLevelsEnum.System:
            signatures.access_signature = env_1.ACCESS_TOKEN_ADMIN_SECRET;
            signatures.refresh_signature = env_1.REFRESH_TOKEN_ADMIN_SECRET;
            break;
        default:
            signatures.access_signature = env_1.ACCESS_TOKEN_USER_SECRET;
            signatures.refresh_signature = env_1.REFRESH_TOKEN_USER_SECRET;
            break;
    }
    return signatures;
};
exports.getSignatures = getSignatures;
const createLoginCredentials = (user) => {
    const signatureLevel = (0, exports.detectSignatureLevel)(user.role);
    const signatures = (0, exports.getSignatures)(signatureLevel);
    const jwtid = (0, uuid_1.v4)();
    const accessToken = (0, exports.generateToken)({
        payload: { id: user._id, email: user.email, role: user.role },
        secret: signatures.access_signature,
        options: { expiresIn: Number(env_1.ACCESS_TOKEN_EXPIRES_IN), jwtid },
    });
    const refreshToken = (0, exports.generateToken)({
        payload: { id: user._id, email: user.email, role: user.role },
        secret: signatures.refresh_signature,
        options: { expiresIn: Number(env_1.REFRESH_TOKEN_EXPIRES_IN), jwtid },
    });
    return { accessToken, refreshToken };
};
exports.createLoginCredentials = createLoginCredentials;
const decodeToken = async ({ authorization, tokenType = TokenEnum.access, }) => {
    const [key, token] = authorization.split(" ");
    if (!token || !key)
        throw new response_1.UnauthorizedException("Missing token parts");
    const signatures = (0, exports.getSignatures)(key);
    const decoded = (0, exports.verifyToken)({
        token,
        secret: tokenType === TokenEnum.access
            ? signatures.access_signature
            : signatures.refresh_signature,
    });
    if (!decoded?.id || !decoded?.iat)
        throw new response_1.BadRequestException("Invalid token");
    if (await tokenModel.findOne({ jti: decoded.jti }))
        throw new response_1.UnauthorizedException("Token revoked");
    const user = await userModel.findOne({ email: decoded?.email });
    if (!user)
        throw new response_1.NotFoundException("User not found");
    if (user.changeCredentialsAt?.getTime() || 0 > decoded.iat * 1000)
        throw new response_1.UnauthorizedException("Token revoked");
    return { user, decoded };
};
exports.decodeToken = decodeToken;
