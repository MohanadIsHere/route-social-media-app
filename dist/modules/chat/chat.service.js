"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const response_1 = require("../../utils/response");
const mongoose_1 = require("mongoose");
const repository_1 = require("../../database/repository");
const models_1 = require("../../database/models");
const gateway_1 = require("../gateway");
class ChatService {
    userModel = new repository_1.UserRepository(models_1.userModel);
    chatModel = new repository_1.ChatRepository(models_1.chatModel);
    constructor() { }
    getChat = async (req, res) => {
        const { userId } = req.params;
        const chat = await this.chatModel.findOne({
            participants: {
                $all: [req.user?._id, mongoose_1.Types.ObjectId.createFromHexString(userId)],
            },
            group: { $exists: false },
        }, {
            populate: [
                {
                    path: "participants",
                    select: "firstName lastName email gender profileImage",
                },
            ],
        });
        if (!chat)
            throw new response_1.NotFoundException("Chat not found");
        return (0, response_1.successResponse)({
            res,
            message: "Chat retrieved successfully",
            data: { chat },
        });
    };
    sayHi = ({ message, socket, callback, io }) => {
        try {
            console.log({ message });
            return callback ? callback(`Hello from BE to {${socket.id}}`) : undefined;
        }
        catch (error) {
            return socket.emit("custom_error", error);
        }
    };
    sendMessage = async ({ content, socket, sendTo, io }) => {
        try {
            const createdBy = socket.credentials?.user._id;
            console.log({ content, sendTo, createdBy });
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
        }
        catch (error) {
            return socket.emit("custom_error", error);
        }
    };
}
exports.ChatService = ChatService;
