import type { Request, Response } from "express";
import {
  BadRequestException,
  NotFoundException,
  successResponse,
} from "../../utils/response";
import {
  CommentRepository,
  PostRepository,
  UserRepository,
} from "../../database/repository";
import { AllowCommentsEnum, Comment, HydratedPostDoc, Post, User } from "../../database/models";
import { Types } from "mongoose";
import { postAvailability } from "../post";
import { deleteFiles, uploadFiles } from "../../utils/aws/S3";

class CommentService {
  constructor() {}
  private userModel = new UserRepository(User);
  private postModel = new PostRepository(Post);
  private commentModel = new CommentRepository(Comment);

  createComment = async (req: Request, res: Response): Promise<Response> => {
    const { postId } = req.params as unknown as { postId: Types.ObjectId };
    const post = await this.postModel.findOne({
      _id: postId,
      allowComments: AllowCommentsEnum.allow,
      $or: postAvailability(req),
    });
    if (!post) throw new NotFoundException("Post not found");
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
    if (req.body.attachments?.length) {
      const upload = await uploadFiles({
        files: req.files as Express.Multer.File[],
        path: `users/${post.createdBy}/posts/${post.assetsFolderId}`,
      });
      attachments = upload;
    }

    const comment =
      (await this.commentModel.create({
        data: {
          ...req.body,
          content: req.body.content || "",
          attachments,
          createdBy: req.user?._id,
          postId,
        },
      })) || {};
    if (!comment) {
      if (attachments.length) {
        await deleteFiles({ urls: attachments });
      }
      throw new BadRequestException("Fail to create comment");
    }

    return successResponse({
      res,
      statusCode: 201,
      message: "Comment created successfully",
      data: {
        comment,
      },
    });
  };

  replyOnComment = async (req: Request, res: Response): Promise<Response> => {
    const { postId, commentId } = req.params as unknown as {
      postId: Types.ObjectId;
      commentId: Types.ObjectId;
    };
    const comment = await this.commentModel.findOne(
      {
        _id: commentId,
        postId,
      },
      {
        populate: [
          {
            path: "postId",
            match: {
              allowComments: AllowCommentsEnum.allow,
              $or: postAvailability(req),
            },
          },
        ],
      }
    );
    if (!comment?.postId) throw new NotFoundException("Comment not found");
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
    if (req.body.attachments?.length) {
      const post = comment?.postId as Partial<HydratedPostDoc>
      const upload = await uploadFiles({
        files: req.files as Express.Multer.File[],
        path: `users/${post.createdBy}/posts/${post.assetsFolderId}`,
      });
      attachments = upload;
    }

    const reply =
      (await this.commentModel.create({
        data: {
          ...req.body,
          content: req.body.content || "",
          attachments,
          commentId,
          createdBy: req.user?._id,
          postId,
        },
      })) || {};
    if (!reply) {
      if (attachments.length) {
        await deleteFiles({ urls: attachments });
      }
      throw new BadRequestException("Fail to reply on comment");
    }

    return successResponse({
      res,
      statusCode: 201,
      message: "Replied on comment successfully",
    });
  };
}

export default new CommentService();
