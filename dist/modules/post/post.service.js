"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../../utils/response");
const repository_1 = require("../../database/repository");
const models_1 = require("../../database/models");
const S3_1 = require("../../utils/aws/S3");
const uuid_1 = require("uuid");
const mongoose_1 = require("mongoose");
class PostService {
    constructor() { }
    postModel = new repository_1.PostRepository(models_1.Post);
    userModel = new repository_1.UserRepository(models_1.User);
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
            attachments = await (0, S3_1.uploadFiles)({
                files: req.files,
                path: `users/${req.user?._id}/posts/${assetsFolderId}`,
            });
        }
        const post = (await this.postModel.create({
            data: {
                ...req.body,
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
    likeAndUnLikePost = async (req, res) => {
        const { postId } = req.params;
        const post = await this.postModel.findOne({
            _id: new mongoose_1.Types.ObjectId(postId),
        });
        if (!post)
            throw new response_1.NotFoundException("Post not found");
        console.log("post found!");
        if (post.likes?.length && post.likes.includes(req.user?._id)) {
            await this.postModel.findByIdAndUpdate({
                id: new mongoose_1.Types.ObjectId(postId),
                update: { $pull: { likes: req.user?._id } },
            });
        }
        else {
            await this.postModel.findByIdAndUpdate({
                id: new mongoose_1.Types.ObjectId(postId),
                update: { $push: { likes: req.user?._id } },
            });
        }
        return (0, response_1.successResponse)({ res });
    };
}
exports.default = new PostService();
