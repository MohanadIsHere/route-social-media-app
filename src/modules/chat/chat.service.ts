import type { Request, Response } from "express";
import type { IGetChatParamsDto, ISayHiDto, ISendMessageDto } from "./dto";
import {
  BadRequestException,
  NotFoundException,
  successResponse,
} from "../../utils/response";
import { Types } from "mongoose";
import { ChatRepository, UserRepository } from "../../database/repository";
import { chatModel, userModel } from "../../database/models";
import { IGetChatResponse } from "./chat.entities";
import { connectedSockets } from "../gateway";

export class ChatService {
  private userModel: UserRepository = new UserRepository(userModel);
  private chatModel: ChatRepository = new ChatRepository(chatModel);

  constructor() {}
  // REST
  getChat = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params as IGetChatParamsDto;
    const chat = await this.chatModel.findOne(
      {
        participants: {
          $all: [req.user?._id, Types.ObjectId.createFromHexString(userId)],
        },
        group: { $exists: false },
      },
      {
        populate: [
          {
            path: "participants",
            select: "firstName lastName email gender profileImage",
          },
        ],
      }
    );
    if (!chat) throw new NotFoundException("Chat not found");

    return successResponse<IGetChatResponse>({
      res,
      message: "Chat retrieved successfully",
      data: { chat },
    });
  };
  // IO
  sayHi = ({ message, socket, callback, io }: ISayHiDto) => {
    try {
      console.log({ message });
      return callback ? callback(`Hello from BE to {${socket.id}}`) : undefined;
    } catch (error) {
      return socket.emit("custom_error", error);
    }
  };
  sendMessage = async ({ content, socket, sendTo, io }: ISendMessageDto) => {
    try {
      const createdBy = socket.credentials?.user._id as Types.ObjectId; // sender
      const user = await this.userModel.findOne({
        _id: Types.ObjectId.createFromHexString(sendTo),
        friends: { $in: createdBy },
      });
      if (!user) throw new NotFoundException("User not found or not a friend");
      // Find or create chat between sender and receiver
      const chat = await this.chatModel.findOneAndUpdate({
        filter: {
          participants: {
            $all: [
              createdBy as Types.ObjectId, // sender
              Types.ObjectId.createFromHexString(sendTo), // receiver
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
              createdBy as Types.ObjectId,
              Types.ObjectId.createFromHexString(sendTo),
            ],
          },
        });
        if (!newChat) throw new BadRequestException("Failed to create chat");
      }
      // notify sender of his sent message
      io?.to(
        connectedSockets.get(createdBy.toString() as string) as string[]
      ).emit("successMessage", { content });

      // notify receiver of new message
      io?.to(connectedSockets.get(sendTo) as string[]).emit("newMessage", {
        content,
        from: socket.credentials?.user,
      });
    } catch (error) {
      return socket.emit("custom_error", error);
    }
  };
}
