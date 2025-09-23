"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudFileUpload = exports.generateNumInMbs = exports.fileValidation = exports.StorageApproachEnum = void 0;
const multer_1 = __importDefault(require("multer"));
const node_os_1 = require("node:os");
const uuid_1 = require("uuid");
const response_1 = require("../response");
var StorageApproachEnum;
(function (StorageApproachEnum) {
    StorageApproachEnum["memory"] = "memory";
    StorageApproachEnum["disk"] = "disk";
})(StorageApproachEnum || (exports.StorageApproachEnum = StorageApproachEnum = {}));
exports.fileValidation = {
    image: ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"],
    video: ["video/mp4", "video/mpeg", "video/quicktime"],
    pdf: ["application/pdf"],
    audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"],
};
const generateNumInMbs = (mbs) => mbs * 1024 * 1024;
exports.generateNumInMbs = generateNumInMbs;
const cloudFileUpload = ({ validation = [], storageApproach = StorageApproachEnum.memory, maxSizeMB = 5, }) => {
    const storage = storageApproach === StorageApproachEnum.memory
        ? multer_1.default.memoryStorage()
        : multer_1.default.diskStorage({
            destination: (0, node_os_1.tmpdir)(),
            filename: function (req, file, cb) {
                cb(null, `${(0, uuid_1.v4)()}_${file.originalname}`);
            },
        });
    function fileFilter(req, file, cb) {
        if (file.size > (0, exports.generateNumInMbs)(maxSizeMB)) {
            return cb(new response_1.BadRequestException("File size is too large"));
        }
        if (!validation.includes(file.mimetype)) {
            return cb(new response_1.BadRequestException("Invalid file type"));
        }
        cb(null, true);
    }
    return (0, multer_1.default)({
        storage,
        fileFilter,
        limits: { fileSize: maxSizeMB * 1024 * 1024 },
    });
};
exports.cloudFileUpload = cloudFileUpload;
