"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const env_1 = require("./env");
const s3Client = () => {
    return new client_s3_1.S3Client({
        region: env_1.AWS_REGION,
        credentials: {
            accessKeyId: env_1.AWS_ACCESS_KEY_ID,
            secretAccessKey: env_1.AWS_SECRET_ACCESS_KEY,
        },
    });
};
exports.s3Client = s3Client;
