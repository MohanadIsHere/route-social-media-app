import { Server } from "socket.io";
import type { IAuthSocket } from "../gateway";
import { ChatService } from "./chat.service";

export class ChatEvent {
  private chatService: ChatService = new ChatService();
  constructor() {}
  sayHi = ({ socket, io }: { socket: IAuthSocket; io: Server }) => {
    return socket.on("sayHi", (message, callback) => {
      this.chatService.sayHi({ message, socket, callback, io });
    });
  };
  sendMessage = ({ socket, io }: { socket: IAuthSocket; io: Server }) => {
    return socket.on(
      "sendMessage",
      (data: { content: string; sendTo: string }) => {
        this.chatService.sendMessage({ socket, ...data, io });
      }
    );
  };
  joinRoom = ({ socket, io }: { socket: IAuthSocket; io: Server }) => {
    return socket.on("joinRoom", (data: { roomId: string }) => {
      this.chatService.joinRoom({ socket, ...data, io });
    });
  };
  sendGroupMessage = ({ socket, io }: { socket: IAuthSocket; io: Server }) => {
    return socket.on(
      "sendGroupMessage",
      (data: { content: string; groupId: string }) => {
        this.chatService.sendGroupMessage({ socket, ...data, io });
      }
    );
  };
  leaveRoom = ({ socket, io }: { socket: IAuthSocket; io: Server }) => {
    return socket.on("leaveRoom", (data: { roomId: string }) => {
      this.chatService.leaveRoom({ socket, ...data, io });
    });
  };
};

