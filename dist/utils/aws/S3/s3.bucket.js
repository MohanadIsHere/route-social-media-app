"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAsset = exports.createPreSignedUrl = exports.uploadLargeFile = exports.uploadFiles = exports.uploadFile = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const fs_1 = require("fs");
const env_1 = require("../../../config/env");
const s3_1 = require("../../../config/s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const response_1 = require("../../response");
const multer_1 = require("../../multer");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uploadFile = async ({ Bucket = env_1.AWS_BUCKET_NAME, ACL = "private", path = "general", file, }) => {
    if (!file)
        throw new response_1.BadRequestException("No file provided");
    const Key = `${env_1.APP_NAME}/${path}/${(0, uuid_1.v4)()}_${file.originalname}`;
    const isLarge = file.size > 5 * 1024 * 1024;
    let Body;
    if (file.buffer) {
        Body = file.buffer;
    }
    else if (file.path) {
        Body = (0, fs_1.createReadStream)(file.path);
    }
    else {
        throw new Error("No file data found");
    }
    if (isLarge) {
        return await (0, exports.uploadLargeFile)({ Bucket, ACL, path, file });
    }
    else {
        const command = new client_s3_1.PutObjectCommand({
            Bucket,
            ACL,
            Key,
            Body,
            ContentType: file.mimetype,
        });
        await (0, s3_1.s3Client)().send(command);
        if (!command.input.Key)
            throw new response_1.BadRequestException("File upload failed");
        return command.input.Key;
    }
};
exports.uploadFile = uploadFile;
const uploadFiles = async ({ Bucket = env_1.AWS_BUCKET_NAME, ACL = "private", path = "general", files, }) => {
    let urls = [];
    urls = await Promise.all(files.map((file) => file.size > (0, multer_1.generateNumInMbs)(5)
        ? (0, exports.uploadLargeFile)({ Bucket, ACL, path, file })
        : (0, exports.uploadFile)({ Bucket, ACL, path, file })));
    return urls;
};
exports.uploadFiles = uploadFiles;
const uploadLargeFile = async ({ Bucket = env_1.AWS_BUCKET_NAME, ACL = "private", path = "general", file, }) => {
    let Body;
    if (file.buffer) {
        Body = file.buffer;
    }
    else if (file.path) {
        Body = (0, fs_1.createReadStream)(file.path);
    }
    else {
        throw new response_1.BadRequestException("No file data found");
    }
    const upload = new lib_storage_1.Upload({
        client: (0, s3_1.s3Client)(),
        params: {
            Bucket,
            ACL,
            Key: `${env_1.APP_NAME}/${path}/${(0, uuid_1.v4)()}_${file.originalname}`,
            Body,
            ContentType: file.mimetype,
        },
    });
    upload.on("httpUploadProgress", (progress) => {
        console.log(`Upload Progress: ${progress.loaded} / ${progress.total}`);
    });
    const { Key } = await upload.done();
    if (!Key)
        throw new response_1.BadRequestException("File upload failed");
    return Key;
};
exports.uploadLargeFile = uploadLargeFile;
const createPreSignedUrl = async ({ Bucket = env_1.AWS_BUCKET_NAME, path, ContentType, originalname, expiresIn = 1800, }) => {
    const command = new client_s3_1.PutObjectCommand({
        Bucket,
        Key: `${env_1.APP_NAME}/${path}/${(0, uuid_1.v4)()}_pre_${originalname}`,
        ContentType,
    });
    const url = await (0, s3_request_presigner_1.getSignedUrl)((0, s3_1.s3Client)(), command, { expiresIn });
    if (!command?.input?.Key || !url)
        throw new response_1.BadRequestException("Could not create pre-signed URL");
    return { url, key: command.input.Key };
};
exports.createPreSignedUrl = createPreSignedUrl;
const getAsset = async ({ Bucket = env_1.AWS_BUCKET_NAME, Key, }) => {
    const command = new client_s3_1.GetObjectCommand({
        Bucket,
        Key,
    });
    return await (0, s3_1.s3Client)().send(command);
};
exports.getAsset = getAsset;
