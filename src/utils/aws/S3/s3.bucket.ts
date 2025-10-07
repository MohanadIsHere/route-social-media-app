import {
  DeleteObjectCommand,
  type DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput,
  GetObjectCommand,
  type GetObjectCommandOutput,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  type ObjectCannedACL,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { createReadStream } from "fs";
import {
  APP_NAME,
  AWS_BUCKET_NAME,
  AWS_PRE_SIGNED_URL_EXPIRES_IN,
} from "../../../config/env";
import { s3Client } from "../../../config/s3.config";
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

  const Key = `${APP_NAME}/${path}/${uuid()}_${file.originalname}`;
  // const Key = encodeURIComponent(rawKey); // encode key

  const upload = new Upload({
    client: s3Client(),
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
  if (!uploadedKey) throw new BadRequestException("File upload failed");
  return uploadedKey;
};

export const createPreSignedUrl = async ({
  Bucket = AWS_BUCKET_NAME as string,
  path,
  ContentType,
  originalname,
  expiresIn = Number(AWS_PRE_SIGNED_URL_EXPIRES_IN),
}: {
  Bucket?: string;
  path?: string;
  originalname: string;
  ContentType: string;
  expiresIn?: number;
}): Promise<{ url: string; key: string }> => {
  // const safeName = encodeURIComponent(originalname);

  const Key = `${APP_NAME}/${path}/${uuid()}_pre_${originalname}`;

  const command = new PutObjectCommand({
    Bucket,
    Key,
    ContentType,
  });

  const url = await getSignedUrl(s3Client(), command, { expiresIn });
  if (!command?.input?.Key || !url) {
    throw new BadRequestException("Could not create pre-signed URL");
  }

  return { url, key: Key };
};

export const getFile = async ({
  Bucket = AWS_BUCKET_NAME as string,
  Key,
}: {
  Bucket?: string;
  Key: string;
}): Promise<GetObjectCommandOutput> => {
  const encodedKey = encodeURIComponent(Key);

  const command = new GetObjectCommand({
    Bucket,
    Key: encodedKey,
  });
  return await s3Client().send(command);
};
export const deleteFile = async ({
  Bucket = AWS_BUCKET_NAME as string,
  Key,
}: {
  Bucket?: string;
  Key: string;
}): Promise<DeleteObjectCommandOutput> => {
  const command = new DeleteObjectCommand({ Bucket, Key });
  return await s3Client().send(command);
};
export const deleteFiles = async ({
  Bucket = AWS_BUCKET_NAME as string,
  urls,
  Quiet = false,
}: {
  Bucket?: string;
  urls: string[];
  Quiet?: boolean;
}): Promise<DeleteObjectsCommandOutput> => {
  const Objects = urls.map((url) => ({ Key: url }));
  const command = new DeleteObjectsCommand({
    Bucket,
    Delete: {
      Objects,
      Quiet,
    },
  });
  return await s3Client().send(command);
};
export const listDirectoryFiles = async ({
  Bucket = AWS_BUCKET_NAME as string,
  path,
}: {
  Bucket?: string;
  path: string;
}): Promise<ListObjectsV2CommandOutput> => {
  const command = new ListObjectsV2Command({
    Bucket: AWS_BUCKET_NAME as string,
    Prefix: `${APP_NAME}/${path}`,
  });
  return await s3Client().send(command);
};
export const deleteDirectoryByPrefix = async ({
  Bucket = AWS_BUCKET_NAME as string,
  path,
  Quiet = false,
}: {
  Bucket?: string;
  path: string;
  Quiet?: boolean;
}) => {
  const list = await listDirectoryFiles({ Bucket, path });
  if (!list?.Contents?.length)
    throw new BadRequestException("No files found to delete");
  const urls: string[] = list.Contents.map((item) => item.Key as string);
  return await deleteFiles({ urls, Bucket, Quiet });
};
