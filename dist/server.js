"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const express_rate_limit_1 = require("express-rate-limit");
const morgan_1 = __importDefault(require("morgan"));
const chalk_1 = __importDefault(require("chalk"));
const auth_controller_1 = __importDefault(require("./modules/auth/auth.controller"));
const error_response_1 = require("./utils/response/error.response");
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const app = (0, express_1.default)();
const port = env_1.PORT || 8303;
const bootstrap = () => {
    const limiter = (0, express_rate_limit_1.rateLimit)({
        windowMs: 15 * 60 * 1000,
        limit: 50,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        ipv6Subnet: 56,
        message: {
            error: "Too many requests, please try again later.",
            status: 429,
        },
    });
    app.use(express_1.default.json(), (0, helmet_1.default)(), (0, cors_1.default)(), limiter, (0, morgan_1.default)("common"));
    app.use("/api/auth", auth_controller_1.default);
    app.get("/", (req, res) => {
        return res
            .status(200)
            .json({ message: `Welcome To ${env_1.APP_NAME} Landing Page 👋 !` });
    });
    app.use(/(.*)/, (req, res) => {
        throw new error_response_1.AppException(`Url ${req.originalUrl} not found, check your endpoint and the method used`, 404);
    });
    app.use(error_middleware_1.default);
    app.listen(port, () => {
        console.log(chalk_1.default.green.bold(`${env_1.APP_NAME} is running on port ${port} 🚀 !`));
    });
};
exports.default = bootstrap;
