import type { Request, Response } from "express";
import { createLoginCredentials, createRevokeToken } from "../../utils/tokens";
import {
  userModel,
  HydratedUserDoc,
  postModel,
  UserRoles,
  friendRequestModel,
  chatModel,
} from "../../database/models";

import type { JwtPayload } from "jsonwebtoken";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  successResponse,
} from "../../utils/response";
import { createPreSignedUrl } from "../../utils/aws/S3";
import {
  ChatRepository,
  FriendRequestRepository,
  PostRepository,
  UserRepository,
} from "../../database/repository";
import { s3Events } from "../../utils/events";
import { AWS_PRE_SIGNED_URL_EXPIRES_IN } from "../../config/env";
import {
  IGetProfileResponse,
  IRefreshTokenResponse,
  IUpdateProfileImageResponse,
} from "./user.entities";
import { Types } from "mongoose";

class UserService {
  private userModel = new UserRepository(userModel);
  private postModel = new PostRepository(postModel);
  private friendRequestModel = new FriendRequestRepository(friendRequestModel);
  private chatModel = new ChatRepository(chatModel);


  constructor() {}

  // get me
  me = async (req: Request, res: Response): Promise<Response> => {
    const profile = await this.userModel.findById(
      req.user?._id as Types.ObjectId,
      {
        populate: [
          {
            path: "friends",
            select: "firstName lastName email gender profileImage",
          },
        ],
      }
    );
    if (!profile) throw new NotFoundException("User not found");
    const groups = await this.chatModel.findFilter({
      filter:{
        participants: { $in: req.user?._id as Types.ObjectId },
        group: { $exists: true },
      }
    })

    return successResponse<IGetProfileResponse>({
      res,

      message: "User Retrieved Successfully",
      data: { user: profile, groups },
    });
  };
  dashboard = async (req: Request, res: Response): Promise<Response> => {
    const result = await Promise.allSettled([
      this.userModel.findFilter({ filter: {} }),
      this.postModel.findFilter({ filter: {} }),
    ]);

    return successResponse({
      res,
      data: { result },
    });
  };
  changeRole = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params as unknown as { userId: Types.ObjectId };
    const { role }: { role: UserRoles } = req.body;
    const denyRoles: UserRoles[] = [role, UserRoles.superAdmin];
    if (req.user?.role === UserRoles.admin) {
      denyRoles.push(UserRoles.admin);
    }
    const user = await this.userModel.findOneAndUpdate({
      filter: {
        _id: userId as Types.ObjectId,
        role: { $nin: denyRoles },
      },
      update: {
        role,
      },
    });
    await Promise.allSettled([
      this.userModel.findFilter({ filter: {} }),
      this.postModel.findFilter({ filter: {} }),
    ]);

    if (!user) throw new NotFoundException("Fail to find matching result");

    return successResponse({
      res,
    });
  };
  sendFriendRequest = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { userId } = req.params as unknown as { userId: Types.ObjectId };
    if (
      await this.userModel.findOne({
        _id: req.user?._id,
        friends: userId,
      })
    )
      throw new BadRequestException("This user is already a friend of you");
    if (String(req.user?._id) === String(userId))
      throw new BadRequestException(
        "You cannot send a friend request to yourself"
      );
    const checkFriendRequestExist = await this.friendRequestModel.findOne({
      createdBy: { $in: [req.user?._id, userId] },
      sendTo: { $in: [req.user?._id, userId] },
      acceptedAt: { $exists: true },
    });
    
    if (checkFriendRequestExist)
      throw new ConflictException("Friend request already exist");
    const user = await this.userModel.findOne({
      _id: userId,
    });
    if (!user) throw new NotFoundException("Invalid recipient");
    const friendRequest = await this.friendRequestModel.create({
      data: {
        createdBy: req.user?._id as Types.ObjectId,
        sendTo: userId,
      },
    });
    if (!friendRequest) throw new BadRequestException("something went wrong");
    return successResponse({
      res,
      statusCode: 201,
    });
  };
  acceptFriendRequest = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { requestId } = req.params as unknown as {
      requestId: Types.ObjectId;
    };

    const friendRequest = await this.friendRequestModel.findOneAndUpdate({
      filter: {
        _id: requestId as Types.ObjectId,
        sendTo: req.user?._id as Types.ObjectId,
        acceptedAt: { $exists: false },
        rejectedAt: { $exists: false },
      },
      update: {
        acceptedAt: new Date(),
      },
    });

    if (!friendRequest)
      throw new NotFoundException("Fail to find matching result");
    await Promise.all([
      await this.userModel.updateOne({
        filter: { _id: friendRequest.createdBy },
        update: {
          $addToSet: { friends: friendRequest.sendTo },
        },
      }),
      await this.userModel.updateOne({
        filter: { _id: friendRequest.sendTo },
        update: {
          $addToSet: { friends: friendRequest.createdBy },
        },
      }),
    ]);
    return successResponse({
      res,
      statusCode: 200,
    });
  };
  rejectFriendRequest = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { requestId } = req.params as unknown as {
      requestId: Types.ObjectId;
    };

    const friendRequest = await this.friendRequestModel.findOneAndUpdate({
      filter: {
        _id: requestId as Types.ObjectId,
        sendTo: req.user?._id as Types.ObjectId,
        acceptedAt: { $exists: false },
      },
      update: {
        rejectedAt: new Date(),
      },
    });

    if (!friendRequest)
      throw new NotFoundException("Fail to find matching result");
    return successResponse({
      res,
      statusCode: 200,
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
      expiresIn: Number(AWS_PRE_SIGNED_URL_EXPIRES_IN) * 1000,
    });

    return successResponse<IUpdateProfileImageResponse>({
      res,
      data: { key, url },
      message: "Pre signed URL created successfully",
    });
  };
}
export default new UserService();
