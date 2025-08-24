"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const errorMiddleware = (error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
        success: false,
        error: Object.keys(error).length > 0 ? error : undefined,
        cause: error.cause ? error.cause : undefined,
        stack: env_1.NODE_ENV === "development" ? error.stack : undefined,
    });
};
exports.default = errorMiddleware;
