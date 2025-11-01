"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatEvent = void 0;
const chat_service_1 = require("./chat.service");
class ChatEvent {
    chatService = new chat_service_1.ChatService();
    constructor() { }
    sayHi = ({ socket, io }) => {
        return socket.on("sayHi", (message, callback) => {
            this.chatService.sayHi({ message, socket, callback, io });
        });
    };
    sendMessage = ({ socket, io }) => {
        return socket.on("sendMessage", (data) => {
            console.log("data:", data);
            this.chatService.sendMessage({ socket, ...data, io });
        });
    };
}
exports.ChatEvent = ChatEvent;
