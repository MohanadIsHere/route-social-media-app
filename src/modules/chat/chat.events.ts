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
}
