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
const middlewares_1 = require("./middlewares");
const response_1 = require("./utils/response");
const connection_db_1 = __importDefault(require("./database/connection.db"));
const node_util_1 = require("node:util");
const node_stream_1 = require("node:stream");
const S3_1 = require("./utils/aws/S3");
const modules_1 = require("./modules");
const createWriteStreamPipeline = (0, node_util_1.promisify)(node_stream_1.pipeline);
const app = (0, express_1.default)();
const port = env_1.PORT || 8303;
const bootstrap = async () => {
    await (0, connection_db_1.default)();
    const limiter = (0, express_rate_limit_1.rateLimit)({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        ipv6Subnet: 56,
        message: {
            error: "Too many requests, please try again later.",
            status: 429,
        },
    });
    app.use(express_1.default.json(), (0, helmet_1.default)(), (0, cors_1.default)(), limiter, (0, morgan_1.default)("common"));
    app.use("/api/auth", modules_1.authRouter);
    app.use("/api/users", modules_1.userRouter);
    app.use("/api/posts", modules_1.postRouter);
    app.get("/", (req, res) => {
        return res
            .status(200)
            .json({ message: `Welcome To ${env_1.APP_NAME} Landing Page 👋 ! ` });
    });
    app.get("/upload/*path", async (req, res) => {
        const { fileName, download = "false", } = req.query;
        const { path } = req.params;
        const Key = path.join("/");
        const s3Response = await (0, S3_1.getFile)({ Key });
        if (!s3Response?.Body)
            throw new response_1.BadRequestException("Fail to fetch this asset");
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Content-Type", `${s3Response.ContentType || "application/octet-stream"}`);
        if (download == "true") {
            res.setHeader("Content-Disposition", `attachment; filename="${fileName || Key.split("/").pop()}"`);
        }
        return await createWriteStreamPipeline(s3Response.Body, res);
    });
    app.use(/(.*)/, (req, res) => {
        throw new response_1.NotFoundException(`Url ${req.originalUrl} not found, check your endpoint and the method used`);
    });
    app.use(middlewares_1.errorMiddleware);
    app.listen(port, () => {
        console.log(chalk_1.default.green.bold(`${env_1.APP_NAME} is running on port ${port} 🚀 !`));
    });
};
exports.default = bootstrap;
