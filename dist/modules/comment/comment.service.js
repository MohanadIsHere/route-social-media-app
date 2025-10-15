"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../../utils/response");
const repository_1 = require("../../database/repository");
const models_1 = require("../../database/models");
const mongoose_1 = require("mongoose");
const post_1 = require("../post");
const S3_1 = require("../../utils/aws/S3");
class CommentService {
    constructor() { }
    userModel = new repository_1.UserRepository(models_1.User);
    postModel = new repository_1.PostRepository(models_1.Post);
    commentModel = new repository_1.CommentRepository(models_1.Comment);
    createComment = async (req, res) => {
        const { postId } = req.params;
        const post = await this.postModel.findOne({
            _id: postId,
            allowComments: models_1.AllowCommentsEnum.allow,
            $or: (0, post_1.postAvailability)(req),
        });
        if (!post)
            throw new response_1.NotFoundException("Post not found");
        if (req.body.tags?.length &&
            (await this.userModel.findFilter({
                filter: { _id: { $in: req.body.tags } },
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
        const comment = (await this.commentModel.create({
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
                await (0, S3_1.deleteFiles)({ urls: attachments });
            }
            throw new response_1.BadRequestException("Fail to create comment");
        }
        return (0, response_1.successResponse)({
            res,
            statusCode: 201,
            message: "Comment created successfully",
            data: {
                comment,
            },
        });
    };
    replyOnComment = async (req, res) => {
        const { postId, commentId } = req.params;
        const comment = await this.commentModel.findOne({
            _id: commentId,
            postId,
        }, {
            populate: [
                {
                    path: "postId",
                    match: {
                        allowComments: models_1.AllowCommentsEnum.allow,
                        $or: (0, post_1.postAvailability)(req),
                    },
                },
            ],
        });
        if (!comment?.postId)
            throw new response_1.NotFoundException("Comment not found");
        if (req.body.tags?.length &&
            (await this.userModel.findFilter({
                filter: { _id: { $in: req.body.tags } },
            })).length !== req.body.tags.length) {
            throw new response_1.NotFoundException("One or more tags not found");
        }
        let attachments = [];
        if (req.body.attachments?.length) {
            const post = comment?.postId;
            const upload = await (0, S3_1.uploadFiles)({
                files: req.files,
                path: `users/${post.createdBy}/posts/${post.assetsFolderId}`,
            });
            attachments = upload;
        }
        const reply = (await this.commentModel.create({
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
                await (0, S3_1.deleteFiles)({ urls: attachments });
            }
            throw new response_1.BadRequestException("Fail to reply on comment");
        }
        return (0, response_1.successResponse)({
            res,
            statusCode: 201,
            message: "Replied on comment successfully",
        });
    };
    likeComment = async (req, res) => {
        const { postId, commentId } = req.params;
        const post = await this.postModel.findOne({
            _id: new mongoose_1.Types.ObjectId(postId),
            $or: (0, post_1.postAvailability)(req),
        });
        if (!post)
            throw new response_1.NotFoundException("Post not found or not accessible");
        const comment = await this.commentModel.findOne({
            _id: new mongoose_1.Types.ObjectId(commentId),
            postId: post._id,
        });
        if (!comment)
            throw new response_1.NotFoundException("Comment not found in this post");
        const isLiked = comment.likes?.some((id) => id.toString() === req.user?._id.toString());
        const update = isLiked
            ? { $pull: { likes: req.user?._id } }
            : { $addToSet: { likes: req.user?._id } };
        const updated = await this.commentModel.findOneAndUpdate({
            filter: { _id: commentId },
            update,
            options: { new: true },
        });
        return (0, response_1.successResponse)({
            res,
            message: isLiked ? "Disliked successfully" : "Liked successfully",
        });
    };
}
exports.default = new CommentService();
