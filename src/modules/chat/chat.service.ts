import type { Request, Response } from "express";
import type {
  ICreateChattingGroupBodyDto,
  IGetChatParamsDto,
  IGetChatQueryDto,
  IGetChattingGroupParamsDto,
  IJoinRoomDto,
  ILeaveRoomDto,
  ISayHiDto,
  ISendGroupMessageDto,
  ISendMessageDto,
} from "./dto";
import {
  BadRequestException,
  NotFoundException,
  successResponse,
} from "../../utils/response";
import { Types } from "mongoose";
import { ChatRepository, UserRepository } from "../../database/repository";
import { chatModel, HydratedChatDoc, userModel } from "../../database/models";
import { IGetChatResponse } from "./chat.entities";
import { connectedSockets } from "../gateway";
import { deleteFile, uploadFile } from "../../utils/aws/S3";
import { v4 as uuid } from "uuid";

export class ChatService {
  private userModel: UserRepository = new UserRepository(userModel);
  private chatModel: ChatRepository = new ChatRepository(chatModel);

  constructor() {}
  // REST
  getChat = async (req: Request, res: Response): Promise<Response> => {
    const { userId }: IGetChatParamsDto = req.params as IGetChatParamsDto;
    const { page, size }: IGetChatQueryDto = req.query as IGetChatQueryDto;
    const chat = await this.chatModel.findOneChat({
      filter: {
        participants: {
          $all: [
            req.user?._id as Types.ObjectId,
            Types.ObjectId.createFromHexString(userId),
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

    if (!chat) throw new NotFoundException("Chat not found");

    return successResponse<IGetChatResponse>({
      res,
      message: "Chat retrieved successfully",
      data: { chat },
    });
  };
  getChattingGroup = async (req: Request, res: Response): Promise<Response> => {
    const { groupId }: IGetChattingGroupParamsDto =
      req.params as IGetChattingGroupParamsDto;
    const { page, size }: IGetChatQueryDto = req.query as IGetChatQueryDto;
    const chat = await this.chatModel.findOneChat({
      filter: {
        _id: Types.ObjectId.createFromHexString(groupId),
        participants: {
          $in: req.user?._id as Types.ObjectId,
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

    if (!chat) throw new NotFoundException("Chat not found");

    return successResponse<IGetChatResponse>({
      res,
      message: "Group retrieved successfully",
      data: { chat },
    });
  };
  createChattingGroup = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { participants, groupName }: ICreateChattingGroupBodyDto =
      req.body as ICreateChattingGroupBodyDto;
    const dbParticipants = participants.map((participant) =>
      Types.ObjectId.createFromHexString(participant)
    );
    const users = await this.userModel.findFilter({
      filter: {
        _id: { $in: dbParticipants },
        friends: { $in: req.user?._id as Types.ObjectId },
      },
    });
    if (participants.length !== users.length)
      throw new NotFoundException(
        "One or more participants not found or not friends"
      );
    let groupImage: string | undefined = undefined;
    const roomId = groupName.replaceAll(/\s+/g, "_") + `_${uuid()}`;
    if (req.file) {
      groupImage = await uploadFile({
        file: req.file as Express.Multer.File,
        path: `chat/${roomId}`,
      });
    }
    const group = await this.chatModel.create({
      data: {
        createdBy: req.user?._id as Types.ObjectId,
        group: groupName,
        groupImage: groupImage as string,
        messages: [],
        participants: [...dbParticipants, req.user?._id as Types.ObjectId],
      },
    });

    if (!group) {
      if (groupImage) {
        await deleteFile({ Key: groupImage });
      }
      throw new BadRequestException("Something went wrong");
    }

    return successResponse<IGetChatResponse>({
      res,
      statusCode: 201,
      message: "Group created successfully",
      data: { chat: group as Partial<HydratedChatDoc> },
    });
  };
  // IO
  sayHi = ({ message, socket, callback, io }: ISayHiDto): void => {
    try {
      callback ? callback(`Hello from BE to {${socket.id}}`) : undefined;
    } catch (error) {
      socket.emit("custom_error", error);
    }
  };
  sendMessage = async ({
    content,
    socket,
    sendTo,
    io,
  }: ISendMessageDto): Promise<void> => {
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
      socket.emit("custom_error", error);
    }
  };
  sendGroupMessage = async ({
    content,
    socket,
    groupId,
    io,
  }: ISendGroupMessageDto): Promise<void> => {
    try {
      const createdBy = socket.credentials?.user._id as Types.ObjectId; // sender

      // Find or create chat between sender and receiver
      const chat = await this.chatModel.findOneAndUpdate({
        filter: {
          _id: Types.ObjectId.createFromHexString(groupId),
          participants: {
            $in: createdBy as Types.ObjectId, // sender
          },
          group: { $exists: true },
        },
        update: {
          $addToSet: { messages: { content, createdBy } },
        },
      });
      if (!chat) throw new NotFoundException("Failed to find group chat");
      // notify sender of his sent message
      io?.to(
        connectedSockets.get(createdBy.toString() as string) as string[]
      ).emit("successMessage", { content });

      // notify group members of new message
      socket?.to(chat.roomId as string).emit("newMessage", {
        content,
        from: socket.credentials?.user,
        groupId,
      });
    } catch (error) {
      socket.emit("custom_error", error);
    }
  };
  joinRoom = async ({ socket, roomId, io }: IJoinRoomDto): Promise<void> => {
    try {
      const chat = await this.chatModel.findOne({
        filter: {
          roomId,
          group: { $exists: true },
          participants: { $in: socket.credentials?.user._id as Types.ObjectId },
        },
      });
      if (!chat) throw new NotFoundException("Chatting group not found");
      console.log("Join :", roomId);

      socket.join(chat.roomId as string);
    } catch (error) {
      socket.emit("custom_error", error);
    }
  };
  leaveRoom = async ({ socket, roomId, io }: ILeaveRoomDto): Promise<void> => {
    try {
      const chat = await this.chatModel.findOneAndUpdate({
        filter: {
          roomId,
          group: { $exists: true },
          participants: { $in: socket.credentials?.user._id as Types.ObjectId },
        },
        update: {
          $pull: {
            participants: socket.credentials?.user._id as Types.ObjectId,
          },
        },
      });
      if (!chat) throw new NotFoundException("Chatting group not found");

      socket.leave(chat.roomId as string);
      io?.to(roomId).emit("leftRoom", {
        roomId,
        user: socket.credentials?.user,
      });
    } catch (error) {
      socket.emit("custom_error", error);
    }
  };
}
