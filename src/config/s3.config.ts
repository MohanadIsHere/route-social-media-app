import { S3Client } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY } from "./env";

export const s3Client = () => {
  return new S3Client({
    region: AWS_REGION as string,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID as string,
      secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
    },
  });
};
