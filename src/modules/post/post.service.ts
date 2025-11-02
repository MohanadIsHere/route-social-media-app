import type { Request, Response } from "express";
import {
  BadRequestException,
  NotFoundException,
  successResponse,
} from "../../utils/response";
import { PostRepository, UserRepository } from "../../database/repository";
import {
  AvailabilityEnum,
  type HydratedPostDoc,
  LikeActionEnum,
  postModel,
  userModel,
} from "../../database/models";
import { deleteFiles, uploadFiles } from "../../utils/aws/S3";
import { v4 as uuid } from "uuid";
import { Types, UpdateQuery } from "mongoose";
import type { LikePostQueryInputsDto } from "./dto";
import { connectedSockets, getIo } from "../gateway";
export const postAvailability = (req: Request) => {
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
  ];
};

class PostService {
  constructor() {}
  private postModel = new PostRepository(postModel);
  private userModel = new UserRepository(userModel);

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
    }

    const post =
      (await this.postModel.create({
        data: {
          ...req.body,
          content: req.body.content || "",
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
  updatePost = async (req: Request, res: Response): Promise<Response> => {
    const { postId } = req.params as unknown as { postId: Types.ObjectId };
    const post = await this.postModel.findOne({
      _id: postId,
      createdBy: req?.user?._id,
    });
    if (!post) throw new NotFoundException("Post not found");
    if (
      req.body.tags?.length &&
      (
        await this.userModel.findFilter({
          filter: { _id: { $in: req.body.tags, $ne: req.user?._id } },
        })
      ).length !== req.body.tags.length
    ) {
      throw new NotFoundException("One or more tags not found");
    }
    let attachments: string[] = [];
    // let assetsFolderId = uuid();
    if (req.body.attachments?.length) {
      const upload = await uploadFiles({
        files: req.files as Express.Multer.File[],
        path: `users/${post.createdBy}/posts/${post.assetsFolderId}`,
      });
      attachments = upload;
    }

    const updatedPost =
      (await this.postModel.updateOne({
        filter: {
          _id: post._id,
        },
        update: [
          {
            $set: {
              content: req.body.content || post.content,
              allowComments: req.body.allowComments || post.allowComments,
              availability: req.body.availability || post.availability,
              attachments: {
                $setUnion: [
                  {
                    $setDifference: [
                      "$attachments",
                      req.body.removedAttachments || [],
                    ],
                  },
                  attachments,
                ],
              },
              tags: {
                $setUnion: [
                  {
                    $setDifference: [
                      "$tags",
                      (req.body.removedTags || []).map((tag: string) => {
                        return Types.ObjectId.createFromHexString(tag);
                      }),
                    ],
                  },
                  (req.body.tags || []).map((tag: string) => {
                    return Types.ObjectId.createFromHexString(tag);
                  }),
                ],
              },
            },
          },
        ],
      })) || {};
    if (!updatedPost.matchedCount) {
      if (attachments.length) {
        await deleteFiles({ urls: attachments });
      } else {
        if (req.body.removedAttachments.length) {
          await deleteFiles({ urls: req.body.removedAttachments });
        }
      }
      throw new BadRequestException("Fail to create post");
    }
    return successResponse({
      res,
      statusCode: 200,
      message: "Post updated successfully",
    });
  };
  likePost = async (req: Request, res: Response): Promise<Response> => {
    const { postId } = req.params;
    const { action } = req.query as LikePostQueryInputsDto;

    let update: UpdateQuery<HydratedPostDoc> = {
      $addToSet: { likes: req.user?._id },
    };
    if (action === LikeActionEnum.like) {
      update = { $push: { likes: req.user?._id } };
    } else {
      update = { $pull: { likes: req.user?._id } };
    }

    const post = await this.postModel.findOneAndUpdate({
      filter: {
        _id: postId,
        $or: postAvailability(req),
      },
      update,
    });
    if (!post) throw new NotFoundException("Post not found");
    if (action !== LikeActionEnum.dislike) {
      getIo()
        .to(connectedSockets.get(post.createdBy.toString()) as string[])
        .emit("likePost", { postId, userId: req.user?._id, action });
    }

    return successResponse({ res });
  };
  getPosts = async (req: Request, res: Response): Promise<Response> => {
    // let { page, size } = req.query as unknown as {
    //   page: number;
    //   size: number;
    // };

    // const posts = await this.postModel.findAndPaginate({
    //   filter: {
    //     $or: postAvailability(req),
    //   },

    //   page,
    //   size,
    // });
    const posts = await this.postModel.findCursor({
      filter: { $or: postAvailability(req) },
    });
    return successResponse({
      res,
      message: "Posts retrieved successfully",
      data: { posts },
    });
  };
}
export default new PostService();
