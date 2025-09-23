import type { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { tmpdir } from "node:os";
import { v4 as uuid } from "uuid";
import { BadRequestException } from "../response";

export enum StorageApproachEnum {
  memory = "memory",
  disk = "disk",
}
export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"],
  video: ["video/mp4", "video/mpeg", "video/quicktime"],
  pdf: ["application/pdf"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"],
};
export const generateNumInMbs = (mbs: number): number => mbs * 1024 * 1024;
export const cloudFileUpload = ({
  validation = [],
  storageApproach = StorageApproachEnum.memory,
  maxSizeMB = 5,
}: {
  validation?: string[];
  storageApproach?: StorageApproachEnum;
  maxSizeMB?: number;
}): multer.Multer => {
  const storage =
    storageApproach === StorageApproachEnum.memory
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination: tmpdir(),
          filename: function (req: Request, file: Express.Multer.File, cb) {
            cb(null, `${uuid()}_${file.originalname}`);
          },
        });

  function fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) {
    if (file.size > generateNumInMbs(maxSizeMB)) {
      return cb(new BadRequestException("File size is too large"));
    }
    if (!validation.includes(file.mimetype)) {
      return cb(new BadRequestException("Invalid file type"));
    }
    cb(null, true);
  }

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });
};
