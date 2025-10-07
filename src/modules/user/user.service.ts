import type { NextFunction, Request, Response } from "express";
import { createLoginCredentials, createRevokeToken } from "../../utils/tokens";
import { User, HydratedUserDoc } from "../../database/models";

import type { JwtPayload } from "jsonwebtoken";
import { NotFoundException, successResponse } from "../../utils/response";
import { createPreSignedUrl } from "../../utils/aws/S3";
import { UserRepository } from "../../database/repository";
import { Types } from "mongoose";
import { s3Events } from "../../utils/events";
import { AWS_PRE_SIGNED_URL_EXPIRES_IN } from "../../config/env";
import {
  IRefreshTokenResponse,
  IUpdateProfileImageResponse,
} from "./user.entities";

class UserService {
  private userModel = new UserRepository(User);
  constructor() {}

  // get me
  me = (req: Request, res: Response, next: NextFunction): Response => {
    return successResponse({
      res,

      message: "User Retrieved Successfully",
      data: { user: req.user, decoded: req.decoded },
    });
  };
  // refresh token
  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const credentials = createLoginCredentials(req.user as HydratedUserDoc);
    await createRevokeToken({ decoded: req?.decoded as JwtPayload });

    return successResponse<IRefreshTokenResponse>({
      res,
      message: "Token refreshed successfully",
      data: {
        credentials,
      },
    });
  };

  updateProfileImage = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    // const key = await uploadFile({
    //   file: req.file as Express.Multer.File,
    //   path: `users/${req.decoded?.id}`,
    // });
    const {
      ContentType,
      originalname,
    }: { ContentType: string; originalname: string } = req.body;

    const { url, key } = await createPreSignedUrl({
      ContentType,
      originalname,
      path: `users/${req.decoded?.id}`,
    });
    const user = await this.userModel.findByIdAndUpdate({
      id: req.user?._id as Types.ObjectId,
      update: { profileImage: key, tmpProfileImage: req.user?.profileImage },
    });

    if (!user) throw new NotFoundException("User not found");

    s3Events.emit("trackProfileImageUpload", {
      userId: req.user?._id,
      oldImageKey: req.user?.profileImage,
      newImageKey: key,
      expiresIn: Number(AWS_PRE_SIGNED_URL_EXPIRES_IN) * 1000, // 30 seconds
    });

    return successResponse<IUpdateProfileImageResponse>({
      res,
      data: { key, url },
      message: "Pre signed URL created successfully",
    });
  };
}
export default new UserService();
