"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const response_1 = require("../../utils/response");
const mongoose_1 = require("mongoose");
const repository_1 = require("../../database/repository");
const models_1 = require("../../database/models");
const gateway_1 = require("../gateway");
const S3_1 = require("../../utils/aws/S3");
const uuid_1 = require("uuid");
class ChatService {
    userModel = new repository_1.UserRepository(models_1.userModel);
    chatModel = new repository_1.ChatRepository(models_1.chatModel);
    constructor() { }
    getChat = async (req, res) => {
        const { userId } = req.params;
        const { page, size } = req.query;
        const chat = await this.chatModel.findOneChat({
            filter: {
                participants: {
                    $all: [
                        req.user?._id,
                        mongoose_1.Types.ObjectId.createFromHexString(userId),
                    ],
                },
                group: { $exists: false },
            },
            options: {
                populate: [
                    {
                        path: "participants",
                        select: "firstName lastName email gender profileImage",
                    },
                ],
            },
            page,
            size,
        });
        if (!chat)
            throw new response_1.NotFoundException("Chat not found");
        return (0, response_1.successResponse)({
            res,
            message: "Chat retrieved successfully",
            data: { chat },
        });
    };
    getChattingGroup = async (req, res) => {
        const { groupId } = req.params;
        const { page, size } = req.query;
        const chat = await this.chatModel.findOneChat({
            filter: {
                _id: mongoose_1.Types.ObjectId.createFromHexString(groupId),
                participants: {
                    $in: req.user?._id,
                },
                group: { $exists: true },
            },
            options: {
                populate: [
                    {
                        path: "messages.createdBy",
                        select: "firstName lastName email gender profileImage",
                    },
                ],
            },
            page,
            size,
        });
        if (!chat)
            throw new response_1.NotFoundException("Chat not found");
        return (0, response_1.successResponse)({
            res,
            message: "Group retrieved successfully",
            data: { chat },
        });
    };
    createChattingGroup = async (req, res) => {
        const { participants, groupName } = req.body;
        const dbParticipants = participants.map((participant) => mongoose_1.Types.ObjectId.createFromHexString(participant));
        const users = await this.userModel.findFilter({
            filter: {
                _id: { $in: dbParticipants },
                friends: { $in: req.user?._id },
            },
        });
        if (participants.length !== users.length)
            throw new response_1.NotFoundException("One or more participants not found or not friends");
        let groupImage = undefined;
        const roomId = groupName.replaceAll(/\s+/g, "_") + `_${(0, uuid_1.v4)()}`;
        if (req.file) {
            groupImage = await (0, S3_1.uploadFile)({
                file: req.file,
                path: `chat/${roomId}`,
            });
        }
        const group = await this.chatModel.create({
            data: {
                createdBy: req.user?._id,
                group: groupName,
                groupImage: groupImage,
                messages: [],
                participants: [...dbParticipants, req.user?._id],
            },
        });
        if (!group) {
            if (groupImage) {
                await (0, S3_1.deleteFile)({ Key: groupImage });
            }
            throw new response_1.BadRequestException("Something went wrong");
        }
        return (0, response_1.successResponse)({
            res,
            statusCode: 201,
            message: "Group created successfully",
            data: { chat: group },
        });
    };
    sayHi = ({ message, socket, callback, io }) => {
        try {
            callback ? callback(`Hello from BE to {${socket.id}}`) : undefined;
        }
        catch (error) {
            socket.emit("custom_error", error);
        }
    };
    sendMessage = async ({ content, socket, sendTo, io, }) => {
        try {
            const createdBy = socket.credentials?.user._id;
            const user = await this.userModel.findOne({
                _id: mongoose_1.Types.ObjectId.createFromHexString(sendTo),
                friends: { $in: createdBy },
            });
            if (!user)
                throw new response_1.NotFoundException("User not found or not a friend");
            const chat = await this.chatModel.findOneAndUpdate({
                filter: {
                    participants: {
                        $all: [
                            createdBy,
                            mongoose_1.Types.ObjectId.createFromHexString(sendTo),
                        ],
                    },
                    group: { $exists: false },
                },
                update: {
                    $addToSet: { messages: { content, createdBy } },
                },
            });
            if (!chat) {
                const newChat = await this.chatModel.create({
                    data: {
                        createdBy,
                        messages: [{ content, createdBy }],
                        participants: [
                            createdBy,
                            mongoose_1.Types.ObjectId.createFromHexString(sendTo),
                        ],
                    },
                });
                if (!newChat)
                    throw new response_1.BadRequestException("Failed to create chat");
            }
            io?.to(gateway_1.connectedSockets.get(createdBy.toString())).emit("successMessage", { content });
            io?.to(gateway_1.connectedSockets.get(sendTo)).emit("newMessage", {
                content,
                from: socket.credentials?.user,
            });
        }
        catch (error) {
            socket.emit("custom_error", error);
        }
    };
    sendGroupMessage = async ({ content, socket, groupId, io, }) => {
        try {
            const createdBy = socket.credentials?.user._id;
            const chat = await this.chatModel.findOneAndUpdate({
                filter: {
                    _id: mongoose_1.Types.ObjectId.createFromHexString(groupId),
                    participants: {
                        $in: createdBy,
                    },
                    group: { $exists: true },
                },
                update: {
                    $addToSet: { messages: { content, createdBy } },
                },
            });
            if (!chat)
                throw new response_1.NotFoundException("Failed to find group chat");
            io?.to(gateway_1.connectedSockets.get(createdBy.toString())).emit("successMessage", { content });
            socket?.to(chat.roomId).emit("newMessage", {
                content,
                from: socket.credentials?.user,
                groupId,
            });
        }
        catch (error) {
            socket.emit("custom_error", error);
        }
    };
    joinRoom = async ({ socket, roomId, io }) => {
        try {
            const chat = await this.chatModel.findOne({
                filter: {
                    roomId,
                    group: { $exists: true },
                    participants: { $in: socket.credentials?.user._id },
                },
            });
            if (!chat)
                throw new response_1.NotFoundException("Chatting group not found");
            console.log("Join :", roomId);
            socket.join(chat.roomId);
        }
        catch (error) {
            socket.emit("custom_error", error);
        }
    };
    leaveRoom = async ({ socket, roomId, io }) => {
        try {
            const chat = await this.chatModel.findOneAndUpdate({
                filter: {
                    roomId,
                    group: { $exists: true },
                    participants: { $in: socket.credentials?.user._id },
                },
                update: {
                    $pull: {
                        participants: socket.credentials?.user._id,
                    },
                },
            });
            if (!chat)
                throw new response_1.NotFoundException("Chatting group not found");
            socket.leave(chat.roomId);
            io?.to(roomId).emit("leftRoom", {
                roomId,
                user: socket.credentials?.user,
            });
        }
        catch (error) {
            socket.emit("custom_error", error);
        }
    };
}
exports.ChatService = ChatService;
