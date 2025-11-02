"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../../utils/tokens");
const models_1 = require("../../database/models");
const response_1 = require("../../utils/response");
const S3_1 = require("../../utils/aws/S3");
const repository_1 = require("../../database/repository");
const events_1 = require("../../utils/events");
const env_1 = require("../../config/env");
class UserService {
    userModel = new repository_1.UserRepository(models_1.userModel);
    postModel = new repository_1.PostRepository(models_1.postModel);
    friendRequestModel = new repository_1.FriendRequestRepository(models_1.friendRequestModel);
    chatModel = new repository_1.ChatRepository(models_1.chatModel);
    constructor() { }
    me = async (req, res) => {
        const profile = await this.userModel.findById(req.user?._id, {
            populate: [
                {
                    path: "friends",
                    select: "firstName lastName email gender profileImage",
                },
            ],
        });
        if (!profile)
            throw new response_1.NotFoundException("User not found");
        const groups = await this.chatModel.findFilter({
            filter: {
                participants: { $in: req.user?._id },
                group: { $exists: true },
            }
        });
        return (0, response_1.successResponse)({
            res,
            message: "User Retrieved Successfully",
            data: { user: profile, groups },
        });
    };
    dashboard = async (req, res) => {
        const result = await Promise.allSettled([
            this.userModel.findFilter({ filter: {} }),
            this.postModel.findFilter({ filter: {} }),
        ]);
        return (0, response_1.successResponse)({
            res,
            data: { result },
        });
    };
    changeRole = async (req, res) => {
        const { userId } = req.params;
        const { role } = req.body;
        const denyRoles = [role, models_1.UserRoles.superAdmin];
        if (req.user?.role === models_1.UserRoles.admin) {
            denyRoles.push(models_1.UserRoles.admin);
        }
        const user = await this.userModel.findOneAndUpdate({
            filter: {
                _id: userId,
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
        if (!user)
            throw new response_1.NotFoundException("Fail to find matching result");
        return (0, response_1.successResponse)({
            res,
        });
    };
    sendFriendRequest = async (req, res) => {
        const { userId } = req.params;
        if (await this.userModel.findOne({
            _id: req.user?._id,
            friends: userId,
        }))
            throw new response_1.BadRequestException("This user is already a friend of you");
        if (String(req.user?._id) === String(userId))
            throw new response_1.BadRequestException("You cannot send a friend request to yourself");
        const checkFriendRequestExist = await this.friendRequestModel.findOne({
            createdBy: { $in: [req.user?._id, userId] },
            sendTo: { $in: [req.user?._id, userId] },
            acceptedAt: { $exists: true },
        });
        if (checkFriendRequestExist)
            throw new response_1.ConflictException("Friend request already exist");
        const user = await this.userModel.findOne({
            _id: userId,
        });
        if (!user)
            throw new response_1.NotFoundException("Invalid recipient");
        const friendRequest = await this.friendRequestModel.create({
            data: {
                createdBy: req.user?._id,
                sendTo: userId,
            },
        });
        if (!friendRequest)
            throw new response_1.BadRequestException("something went wrong");
        return (0, response_1.successResponse)({
            res,
            statusCode: 201,
        });
    };
    acceptFriendRequest = async (req, res) => {
        const { requestId } = req.params;
        const friendRequest = await this.friendRequestModel.findOneAndUpdate({
            filter: {
                _id: requestId,
                sendTo: req.user?._id,
                acceptedAt: { $exists: false },
                rejectedAt: { $exists: false },
            },
            update: {
                acceptedAt: new Date(),
            },
        });
        if (!friendRequest)
            throw new response_1.NotFoundException("Fail to find matching result");
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
        return (0, response_1.successResponse)({
            res,
            statusCode: 200,
        });
    };
    rejectFriendRequest = async (req, res) => {
        const { requestId } = req.params;
        const friendRequest = await this.friendRequestModel.findOneAndUpdate({
            filter: {
                _id: requestId,
                sendTo: req.user?._id,
                acceptedAt: { $exists: false },
            },
            update: {
                rejectedAt: new Date(),
            },
        });
        if (!friendRequest)
            throw new response_1.NotFoundException("Fail to find matching result");
        return (0, response_1.successResponse)({
            res,
            statusCode: 200,
        });
    };
    refreshToken = async (req, res) => {
        const credentials = (0, tokens_1.createLoginCredentials)(req.user);
        await (0, tokens_1.createRevokeToken)({ decoded: req?.decoded });
        return (0, response_1.successResponse)({
            res,
            message: "Token refreshed successfully",
            data: {
                credentials,
            },
        });
    };
    updateProfileImage = async (req, res) => {
        const { ContentType, originalname, } = req.body;
        const { url, key } = await (0, S3_1.createPreSignedUrl)({
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
        if (!user)
            throw new response_1.NotFoundException("User not found");
        events_1.s3Events.emit("trackProfileImageUpload", {
            userId: req.user?._id,
            oldImageKey: req.user?.profileImage,
            newImageKey: key,
            expiresIn: Number(env_1.AWS_PRE_SIGNED_URL_EXPIRES_IN) * 1000,
        });
        return (0, response_1.successResponse)({
            res,
            data: { key, url },
            message: "Pre signed URL created successfully",
        });
    };
}
exports.default = new UserService();
