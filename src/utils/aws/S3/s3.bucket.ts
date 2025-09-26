import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { createReadStream } from "fs";
import { APP_NAME, AWS_BUCKET_NAME } from "../../../config/env";
import { s3Client } from "../../../config/s3";
import { Upload } from "@aws-sdk/lib-storage";
import { BadRequestException } from "../../response";
import { generateNumInMbs } from "../../multer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadFile = async ({
  Bucket = AWS_BUCKET_NAME as string,
  ACL = "private",
  path = "general",
  file,
}: {
  Bucket?: string;
  ACL?: ObjectCannedACL;
  file: Express.Multer.File;
  path?: string;
}): Promise<string> => {
  if (!file) throw new BadRequestException("No file provided");

  const Key = `${APP_NAME}/${path}/${uuid()}_${file.originalname}`;
  const isLarge = file.size > 5 * 1024 * 1024; // 5MB

  let Body: any;
  if (file.buffer) {
    Body = file.buffer;
  } else if (file.path) {
    Body = createReadStream(file.path);
  } else {
    throw new Error("No file data found");
  }

  if (isLarge) {
    // Large file → Multipart Upload
    return await uploadLargeFile({ Bucket, ACL, path, file });
  } else {
    // Small file → Simple Upload
    const command = new PutObjectCommand({
      Bucket,
      ACL,
      Key,
      Body,
      ContentType: file.mimetype,
    });

    await s3Client().send(command);
    if (!command.input.Key) throw new BadRequestException("File upload failed");
    return command.input.Key;
  }
};
export const uploadFiles = async ({
  Bucket = AWS_BUCKET_NAME as string,
  ACL = "private",
  path = "general",
  files,
}: {
  Bucket?: string;
  ACL?: ObjectCannedACL;
  files: Express.Multer.File[];
  path?: string;
}): Promise<string[]> => {
  let urls: string[] = [];
  urls = await Promise.all(
    files.map((file) =>
      file.size > generateNumInMbs(5) // 5MB
        ? uploadLargeFile({ Bucket, ACL, path, file })
        : uploadFile({ Bucket, ACL, path, file })
    )
  );
  return urls;
};

export const uploadLargeFile = async ({
  Bucket = AWS_BUCKET_NAME as string,
  ACL = "private",
  path = "general",
  file,
}: {
  Bucket?: string;
  ACL?: ObjectCannedACL;
  file: Express.Multer.File;
  path?: string;
}): Promise<string> => {
  let Body: any;

  if (file.buffer) {
    Body = file.buffer;
  } else if (file.path) {
    Body = createReadStream(file.path);
  } else {
    throw new BadRequestException("No file data found");
  }

  const upload = new Upload({
    client: s3Client(),
    params: {
      Bucket,
      ACL,
      Key: `${APP_NAME}/${path}/${uuid()}_${file.originalname}`,
      Body,
      ContentType: file.mimetype,
    },
  });

  upload.on("httpUploadProgress", (progress) => {
    console.log(`Upload Progress: ${progress.loaded} / ${progress.total}`);
  });
  const { Key } = await upload.done();
  if (!Key) throw new BadRequestException("File upload failed");
  return Key;
};
export const createPreSignedUrl = async ({
  Bucket = AWS_BUCKET_NAME as string,
  path,
  ContentType,
  originalname,
  expiresIn = 3600,
}: {
  Bucket?: string;
  path?: string;
  originalname: string;
  ContentType: string;
  expiresIn?: number;
}): Promise<{ url: string; key: string }> => {
  const command = new PutObjectCommand({
    Bucket,
    Key: `${APP_NAME}/${path}/${uuid()}_${originalname}`,
    ContentType,
  });
  const url = await getSignedUrl(s3Client(), command, { expiresIn });
  if (!command?.input?.Key || !url)
    throw new BadRequestException("Could not create pre-signed URL");
  return { url, key: command.input.Key };
};
