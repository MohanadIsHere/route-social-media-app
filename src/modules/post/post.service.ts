import type { Request, Response } from "express";
import { BadRequestException, NotFoundException, successResponse } from "../../utils/response";
import { PostRepository, UserRepository } from "../../database/repository";
import { Post, User } from "../../database/models";
import { deleteFiles, uploadFiles } from "../../utils/aws/S3";
import { v4 as uuid } from "uuid";
import { Types } from "mongoose";

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
      attachments = await uploadFiles({
        files: req.files as Express.Multer.File[],
        path: `users/${req.user?._id}/posts/${assetsFolderId}`,
      });
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
  likeAndUnLikePost = async (req: Request, res: Response): Promise<Response> => {
    const { postId } = req.params;
    const post = await this.postModel.findOne({
      _id: new Types.ObjectId(postId),
    });
    if (!post) throw new NotFoundException("Post not found");
    console.log("post found!");
    if (post.likes?.length && post.likes.includes(req.user?._id!)) {
      await this.postModel.findByIdAndUpdate({
        id: new Types.ObjectId(postId),
        update: { $pull: { likes: req.user?._id } },
      });
    } else {
      await this.postModel.findByIdAndUpdate({
        id: new Types.ObjectId(postId),
        update: { $push: { likes: req.user?._id } },
      });
    }

    return successResponse({ res });
  };
}
export default new PostService();
