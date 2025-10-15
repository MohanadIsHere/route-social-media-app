"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoint = exports.authorization = exports.authentication = void 0;
const tokens_1 = require("../utils/tokens");
const response_1 = require("../utils/response");
const user_model_1 = require("../database/models/user.model");
const authentication = (tokenType = tokens_1.TokenEnum.access) => {
    return async (req, res, next) => {
        if (!req.headers.authorization) {
            throw new response_1.BadRequestException("Authorization header missing");
        }
        const { user, decoded } = await (0, tokens_1.decodeToken)({
            authorization: req.headers.authorization,
        });
        req.user = user;
        req.decoded = decoded;
        next();
    };
};
exports.authentication = authentication;
const authorization = (accessRoles = []) => {
    return async (req, res, next) => {
        if (!req.headers.authorization) {
            throw new response_1.BadRequestException("Authorization header missing");
        }
        const { user, decoded } = await (0, tokens_1.decodeToken)({
            authorization: req.headers.authorization,
        });
        if (!accessRoles.includes(user.role)) {
            throw new response_1.ForbiddenException("Unauthorized");
        }
        req.user = user;
        req.decoded = decoded;
        next();
    };
};
exports.authorization = authorization;
exports.endpoint = {
    dashboard: [user_model_1.UserRoles.admin, user_model_1.UserRoles.superAdmin]
};
