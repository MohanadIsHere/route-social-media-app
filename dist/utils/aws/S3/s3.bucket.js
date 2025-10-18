"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDirectoryByPrefix = exports.listDirectoryFiles = exports.deleteFiles = exports.deleteFile = exports.getFile = exports.createPreSignedUrl = exports.uploadLargeFile = exports.uploadFiles = exports.uploadFile = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const fs_1 = require("fs");
const env_1 = require("../../../config/env");
const s3_config_1 = require("../../../config/s3.config");
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
        await (0, s3_config_1.s3Client)().send(command);
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
    const Key = `${env_1.APP_NAME}/${path}/${(0, uuid_1.v4)()}_${file.originalname}`;
    const upload = new lib_storage_1.Upload({
        client: (0, s3_config_1.s3Client)(),
        params: {
            Bucket,
            ACL,
            Key,
            Body,
            ContentType: file.mimetype,
        },
    });
    upload.on("httpUploadProgress", (progress) => {
        console.log(`Upload Progress: ${progress.loaded} / ${progress.total}`);
    });
    const { Key: uploadedKey } = await upload.done();
    if (!uploadedKey)
        throw new response_1.BadRequestException("File upload failed");
    return uploadedKey;
};
exports.uploadLargeFile = uploadLargeFile;
const createPreSignedUrl = async ({ Bucket = env_1.AWS_BUCKET_NAME, path, ContentType, originalname, expiresIn = Number(env_1.AWS_PRE_SIGNED_URL_EXPIRES_IN), }) => {
    const Key = `${env_1.APP_NAME}/${path}/${(0, uuid_1.v4)()}-pre-${originalname}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket,
        Key,
        ContentType,
    });
    const url = await (0, s3_request_presigner_1.getSignedUrl)((0, s3_config_1.s3Client)(), command, { expiresIn });
    if (!command?.input?.Key || !url) {
        throw new response_1.BadRequestException("Could not create pre-signed URL");
    }
    return { url, key: Key };
};
exports.createPreSignedUrl = createPreSignedUrl;
const getFile = async ({ Bucket = env_1.AWS_BUCKET_NAME, Key, }) => {
    Key;
    const command = new client_s3_1.GetObjectCommand({
        Bucket,
        Key,
    });
    return await (0, s3_config_1.s3Client)().send(command);
};
exports.getFile = getFile;
const deleteFile = async ({ Bucket = env_1.AWS_BUCKET_NAME, Key, }) => {
    const command = new client_s3_1.DeleteObjectCommand({ Bucket, Key });
    return await (0, s3_config_1.s3Client)().send(command);
};
exports.deleteFile = deleteFile;
const deleteFiles = async ({ Bucket = env_1.AWS_BUCKET_NAME, urls, Quiet = false, }) => {
    const Objects = urls.map((url) => ({ Key: url }));
    const command = new client_s3_1.DeleteObjectsCommand({
        Bucket,
        Delete: {
            Objects,
            Quiet,
        },
    });
    return await (0, s3_config_1.s3Client)().send(command);
};
exports.deleteFiles = deleteFiles;
const listDirectoryFiles = async ({ Bucket = env_1.AWS_BUCKET_NAME, path, }) => {
    const command = new client_s3_1.ListObjectsV2Command({
        Bucket: env_1.AWS_BUCKET_NAME,
        Prefix: `${env_1.APP_NAME}/${path}`,
    });
    return await (0, s3_config_1.s3Client)().send(command);
};
exports.listDirectoryFiles = listDirectoryFiles;
const deleteDirectoryByPrefix = async ({ Bucket = env_1.AWS_BUCKET_NAME, path, Quiet = false, }) => {
    const list = await (0, exports.listDirectoryFiles)({ Bucket, path });
    if (!list?.Contents?.length)
        throw new response_1.BadRequestException("No files found to delete");
    const urls = list.Contents.map((item) => item.Key);
    return await (0, exports.deleteFiles)({ urls, Bucket, Quiet });
};
exports.deleteDirectoryByPrefix = deleteDirectoryByPrefix;
