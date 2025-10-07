"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const errorMiddleware = (error, req, res, next) => {
    if (error.name === "TokenExpiredError") {
        error.message = "Session expired, please login again";
        error.statusCode = 401;
    }
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
        success: false,
        statusCode: error.statusCode,
        cause: error.cause ? error.cause : undefined,
        stack: env_1.NODE_ENV === "development" ? error.stack : undefined,
    });
};
exports.default = errorMiddleware;
