import type { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import os from "node:os";
import { v4 as uuid } from "uuid";

export enum StorageApproachEnum {
  memory = "memory",
  disk = "disk",
}
export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
  video: ["video/mp4", "video/mpeg", "video/quicktime"],
  pdf: ["application/pdf"],
};
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
          destination: os.tmpdir(),
          filename: function (req: Request, file: Express.Multer.File, cb) {
            cb(null, `${uuid()}-${file.originalname}`);
          },
        });

  function fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) {
    if (!validation.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  }

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });
};
