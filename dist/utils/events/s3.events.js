"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Events = void 0;
const chalk_1 = __importDefault(require("chalk"));
const node_events_1 = require("node:events");
const env_1 = require("../../config/env");
const S3_1 = require("../aws/S3");
const repository_1 = require("../../database/repository");
const models_1 = require("../../database/models");
exports.s3Events = new node_events_1.EventEmitter({});
exports.s3Events.on("trackProfileImageUpload", (data) => {
    console.log(chalk_1.default.blue("Tracking S3 event:"));
    console.log(data);
    setTimeout(async () => {
        const _userModel = new repository_1.UserRepository(models_1.userModel);
        try {
            await (0, S3_1.getFile)({ Key: data.newImageKey });
            const updateResult = await _userModel.updateOne({
                filter: { _id: data.userId },
                update: {
                    $unset: { tmpProfileImage: "" },
                },
            });
            const deleteResult = await (0, S3_1.deleteFile)({ Key: data.oldImageKey });
            console.log("update result : ", updateResult);
            console.log("delete result : ", deleteResult);
            console.log(chalk_1.default.green("New image successfully fetched from S3:", data.newImageKey));
        }
        catch (error) {
            console.log(chalk_1.default.red("Error fetching new image from S3:", error.message));
            console.log(error);
            if (error.Code === "NoSuchKey") {
                await _userModel.updateOne({
                    filter: { _id: data.userId },
                    update: {
                        profileImage: data.oldImageKey,
                        $unset: { tmpProfileImage: "" },
                    },
                });
            }
        }
    }, data.expiresIn || (Number(env_1.AWS_PRE_SIGNED_URL_EXPIRES_IN) / 2) * 1000);
});
