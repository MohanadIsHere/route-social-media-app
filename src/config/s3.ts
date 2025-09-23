import {
  type ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  APP_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from "./env";
import { v4 as uuid } from "uuid";
import { createReadStream } from "node:fs";
import { BadRequestException } from "../utils/response";

export const s3Client = () => {
  return new S3Client({
    region: AWS_REGION as string,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID as string,
      secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
    },
  });
};

