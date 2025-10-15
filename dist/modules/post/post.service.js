"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAvailability = void 0;
const response_1 = require("../../utils/response");
const repository_1 = require("../../database/repository");
const models_1 = require("../../database/models");
const S3_1 = require("../../utils/aws/S3");
const uuid_1 = require("uuid");
const mongoose_1 = require("mongoose");
const postAvailability = (req) => {
    return [
        { availability: models_1.AvailabilityEnum.public },
        { availability: models_1.AvailabilityEnum.onlyMe, createdBy: req.user?._id },
        {
            availability: models_1.AvailabilityEnum.friends,
            createdBy: { $in: [...(req.user?.friends || []), req.user?._id] },
        },
        {
            availability: { $ne: models_1.AvailabilityEnum.onlyMe },
            tags: { $in: req.user?._id },
        },
    ];
};
exports.postAvailability = postAvailability;
class PostService {
    constructor() { }
    postModel = new repository_1.PostRepository(models_1.postModel);
    userModel = new repository_1.UserRepository(models_1.userModel);
    createPost = async (req, res) => {
        if (req.body.tags?.length &&
            (await this.userModel.findFilter({
                filter: { _id: { $in: req.body.tags } },
            })).length !== req.body.tags.length) {
            throw new response_1.NotFoundException("One or more tags not found");
        }
        let attachments = [];
        let assetsFolderId = (0, uuid_1.v4)();
        if (req.body.attachments?.length) {
            const upload = await (0, S3_1.uploadFiles)({
                files: req.files,
                path: `users/${req.user?._id}/posts/${assetsFolderId}`,
            });
            attachments = upload;
        }
        const post = (await this.postModel.create({
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
                await (0, S3_1.deleteFiles)({ urls: attachments });
            }
            throw new response_1.BadRequestException("Fail to create post");
        }
        return (0, response_1.successResponse)({
            res,
            statusCode: 201,
            message: "Post created successfully",
            data: {
                post,
            },
        });
    };
    updatePost = async (req, res) => {
        const { postId } = req.params;
        const post = await this.postModel.findOne({
            _id: postId,
            createdBy: req?.user?._id,
        });
        if (!post)
            throw new response_1.NotFoundException("Post not found");
        if (req.body.tags?.length &&
            (await this.userModel.findFilter({
                filter: { _id: { $in: req.body.tags, $ne: req.user?._id } },
            })).length !== req.body.tags.length) {
            throw new response_1.NotFoundException("One or more tags not found");
        }
        let attachments = [];
        if (req.body.attachments?.length) {
            const upload = await (0, S3_1.uploadFiles)({
                files: req.files,
                path: `users/${post.createdBy}/posts/${post.assetsFolderId}`,
            });
            attachments = upload;
        }
        const updatedPost = (await this.postModel.updateOne({
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
                                        (req.body.removedTags || []).map((tag) => {
                                            return mongoose_1.Types.ObjectId.createFromHexString(tag);
                                        }),
                                    ],
                                },
                                (req.body.tags || []).map((tag) => {
                                    return mongoose_1.Types.ObjectId.createFromHexString(tag);
                                }),
                            ],
                        },
                    },
                },
            ],
        })) || {};
        if (!updatedPost.matchedCount) {
            if (attachments.length) {
                await (0, S3_1.deleteFiles)({ urls: attachments });
            }
            else {
                if (req.body.removedAttachments.length) {
                    await (0, S3_1.deleteFiles)({ urls: req.body.removedAttachments });
                }
            }
            throw new response_1.BadRequestException("Fail to create post");
        }
        return (0, response_1.successResponse)({
            res,
            statusCode: 200,
            message: "Post updated successfully",
        });
    };
    likePost = async (req, res) => {
        const { postId } = req.params;
        const { action } = req.query;
        let update = {
            $addToSet: { likes: req.user?._id },
        };
        if (action === models_1.LikeActionEnum.like) {
            update = { $push: { likes: req.user?._id } };
        }
        else {
            update = { $pull: { likes: req.user?._id } };
        }
        const post = await this.postModel.findOne({
            _id: new mongoose_1.Types.ObjectId(postId),
        });
        if (!post)
            throw new response_1.NotFoundException("Post not found");
        await this.postModel.findOneAndUpdate({
            filter: {
                _id: postId,
                $or: (0, exports.postAvailability)(req),
            },
            update,
        });
        return (0, response_1.successResponse)({ res });
    };
    getPosts = async (req, res) => {
        const posts = await this.postModel.findCursor({
            filter: { $or: (0, exports.postAvailability)(req) },
        });
        return (0, response_1.successResponse)({
            res,
            message: "Posts retrieved successfully",
            data: { posts },
        });
    };
}
exports.default = new PostService();
