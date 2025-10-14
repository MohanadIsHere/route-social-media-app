import type { Request, Response } from "express";
import {
  BadRequestException,
  NotFoundException,
  successResponse,
} from "../../utils/response";
import { PostRepository, UserRepository } from "../../database/repository";
import {
  AvailabilityEnum,
  HydratedPostDoc,
  LikeActionEnum,
  Post,
  User,
} from "../../database/models";
import { deleteFiles, uploadFiles } from "../../utils/aws/S3";
import { v4 as uuid } from "uuid";
import { Types, UpdateQuery } from "mongoose";
import type { LikePostQueryInputsDto } from "./dto";
export const postAvailability = (req:Request) => {
  return [
          { availability: AvailabilityEnum.public },
          { availability: AvailabilityEnum.onlyMe, createdBy: req.user?._id },
          {
            availability: AvailabilityEnum.friends,
            createdBy: { $in: [...(req.user?.friends || []), req.user?._id] },
          },
          {
            availability: { $ne: AvailabilityEnum.onlyMe },
            tags: { $in: req.user?._id },
          },
        ]
}

class PostService {
  constructor() {}
  private postModel = new PostRepository(Post);
  private userModel = new UserRepository(User);

  createPost = async (req: Request, res: Response): Promise<Response> => {
    if (
      req.body.tags?.length &&
      (
        await this.userModel.findFilter({
          filter: { _id: { $in: req.body.tags } },
        })
      ).length !== req.body.tags.length
    ) {
      throw new NotFoundException("One or more tags not found");
    }
    let attachments: string[] = [];
    let assetsFolderId = uuid();
    if (req.body.attachments?.length) {
      const upload = await uploadFiles({
        files: req.files as Express.Multer.File[],
        path: `users/${req.user?._id}/posts/${assetsFolderId}`,
      });
      attachments = upload;
      console.log({ upload });
    }

    const post =
      (await this.postModel.create({
        data: {
          ...req.body,
          attachments,
          assetsFolderId,
          createdBy: req.user?._id,
        },
      })) || {};
    if (!post) {
      if (attachments.length) {
        await deleteFiles({ urls: attachments });
      }
      throw new BadRequestException("Fail to create post");
    }
    return successResponse({
      res,
      statusCode: 201,
      message: "Post created successfully",
      data: {
        post,
      },
    });
  };
  likePost = async (req: Request, res: Response): Promise<Response> => {
    const { postId } = req.params;
    const { action } = req.query as LikePostQueryInputsDto;
    console.log(action);

    let update: UpdateQuery<HydratedPostDoc> = {
      $addToSet: { likes: req.user?._id },
    };
    if (action === LikeActionEnum.like) {
      update = { $push: { likes: req.user?._id } };
    } else {
      update = { $pull: { likes: req.user?._id } };
    }
    const post = await this.postModel.findOne({
      _id: new Types.ObjectId(postId),
    });
    if (!post) throw new NotFoundException("Post not found");
    await this.postModel.findOneAndUpdate({
      filter: {
        _id: postId,
        $or: postAvailability(req),
      },
      update,
    });

    return successResponse({ res });
  };
}
export default new PostService();
