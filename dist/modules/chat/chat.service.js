"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
class ChatService {
    constructor() { }
    sayHi = ({ message, socket, callback, io }) => {
        try {
            console.log({ message });
            return callback ? callback(`Hello from BE to {${socket.id}}`) : undefined;
        }
        catch (error) {
            return socket.emit("custom_error", error);
        }
    };
}
exports.ChatService = ChatService;
