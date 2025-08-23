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
    app.use(express_1.default.json());
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(limiter);
    app.listen(port, () => {
        console.log(`Social Media API is running on port ${port} 🚀 !`);
    });
};
exports.default = bootstrap;
