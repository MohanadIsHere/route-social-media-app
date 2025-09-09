"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoginCredentials = exports.getSignatures = exports.detectSignatureLevel = exports.generateToken = exports.SignatureLevelsEnum = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const env_1 = require("../../config/env");
const user_model_1 = require("../../database/models/user.model");
var SignatureLevelsEnum;
(function (SignatureLevelsEnum) {
    SignatureLevelsEnum["Bearer"] = "Bearer";
    SignatureLevelsEnum["System"] = "System";
})(SignatureLevelsEnum || (exports.SignatureLevelsEnum = SignatureLevelsEnum = {}));
const generateToken = ({ payload, secret = env_1.ACCESS_TOKEN_USER_SECRET, options = { expiresIn: Number(env_1.ACCESS_TOKEN_EXPIRES_IN) }, }) => {
    return (0, jsonwebtoken_1.sign)({ ...payload }, secret, options);
};
exports.generateToken = generateToken;
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
    const accessToken = (0, exports.generateToken)({
        payload: { id: user._id, email: user.email, role: user.role },
        secret: signatures.access_signature,
        options: { expiresIn: Number(env_1.ACCESS_TOKEN_EXPIRES_IN) },
    });
    const refreshToken = (0, exports.generateToken)({
        payload: { id: user._id, email: user.email, role: user.role },
        secret: signatures.refresh_signature,
        options: { expiresIn: Number(env_1.REFRESH_TOKEN_EXPIRES_IN) },
    });
    return { accessToken, refreshToken };
};
exports.createLoginCredentials = createLoginCredentials;
