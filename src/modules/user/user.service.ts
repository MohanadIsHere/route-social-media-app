import type { NextFunction, Request, Response } from "express";
import { createLoginCredentials, createRevokeToken } from "../../utils/tokens";
import {
  userModel,
  HydratedUserDoc,
  postModel,
  UserRoles,
} from "../../database/models";

import type { JwtPayload } from "jsonwebtoken";
import { NotFoundException, successResponse } from "../../utils/response";
import { createPreSignedUrl } from "../../utils/aws/S3";
import { PostRepository, UserRepository } from "../../database/repository";
import { s3Events } from "../../utils/events";
import { AWS_PRE_SIGNED_URL_EXPIRES_IN } from "../../config/env";
import {
  IRefreshTokenResponse,
  IUpdateProfileImageResponse,
} from "./user.entities";
import { Types } from "mongoose";

class UserService {
  private userModel = new UserRepository(userModel);
  private postModel = new PostRepository(postModel);

  constructor() {}

  // get me
  me = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    return successResponse({
      res,

      message: "User Retrieved Successfully",
      data: { user: req.user, decoded: req.decoded },
    });
  };
  dashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const result = await Promise.allSettled([
      this.userModel.findFilter({ filter: {} }),
      this.postModel.findFilter({ filter: {} }),
    ]);

    return successResponse({
      res,
      data: { result },
    });
  };
  changeRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { userId } = req.params as unknown as { userId: Types.ObjectId };
    const { role }: { role: UserRoles } = req.body;
    const denyRoles:UserRoles[]=[role,UserRoles.superAdmin];
    if(req.user?.role === UserRoles.admin){
      denyRoles.push(UserRoles.admin)
    }
    const user = await this.userModel.findOneAndUpdate({
      filter: {
        _id: userId as Types.ObjectId,
        role:{$nin:denyRoles}
      },
      update: {
        role,
      },
    });
    const result = await Promise.allSettled([
      this.userModel.findFilter({ filter: {} }),
      this.postModel.findFilter({ filter: {} }),
    ]);

    if(!user) throw new NotFoundException("Fail to find matching result")

    return successResponse({
      res,
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
    const user = await this.userModel.findOneAndUpdate({
      filter: {
        _id: req.user?._id,
      },
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
