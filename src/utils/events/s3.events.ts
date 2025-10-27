import chalk from "chalk";
import { EventEmitter } from "node:events";
import { AWS_PRE_SIGNED_URL_EXPIRES_IN } from "../../config/env";
import { deleteFile, getFile } from "../aws/S3";
import { UserRepository } from "../../database/repository";
import { HydratedUserDoc, userModel } from "../../database/models";
import { Types, UpdateQuery } from "mongoose";
export const s3Events = new EventEmitter({});

s3Events.on(
  "trackProfileImageUpload",
  (data: {
    userId: Types.ObjectId;
    oldImageKey: string;
    newImageKey: string;
    expiresIn: number;
  }) => {
    console.log(chalk.blue("Tracking S3 event:"));
    console.log(data);

    setTimeout(async () => {
      const _userModel = new UserRepository(userModel);
      try {
        await getFile({ Key: data.newImageKey });
        const updateResult = await _userModel.updateOne({
          filter: { _id: data.userId as Types.ObjectId },
          update: {
            $unset: { tmpProfileImage: "" },
          },
        });
        const deleteResult = await deleteFile({ Key: data.oldImageKey });
        console.log("update result : ", updateResult);
        console.log("delete result : ", deleteResult);

        console.log(
          chalk.green(
            "New image successfully fetched from S3:",
            data.newImageKey
          )
        );
      } catch (error: any) {
        console.log(
          chalk.red("Error fetching new image from S3:", error.message)
        );
        console.log(error);
        if (error.Code === "NoSuchKey") {
          let unsetData: UpdateQuery<HydratedUserDoc> = { tmpProfileImage: 1 };
          if (data.oldImageKey) {
            unsetData = { tmpProfileImage: 1, profilePicture: 1 };
          }
          await _userModel.updateOne({
            filter: { _id: data.userId as Types.ObjectId },
            update: {
              profileImage: data.oldImageKey,
              $unset: { tmpProfileImage: "" },
            },
          });
        }
      }
    }, data.expiresIn || (Number(AWS_PRE_SIGNED_URL_EXPIRES_IN) / 2) * 1000);
  }
);
