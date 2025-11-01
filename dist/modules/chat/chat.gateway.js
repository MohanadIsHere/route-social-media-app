"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const chat_events_1 = require("./chat.events");
class ChatGateway {
    chatEvent = new chat_events_1.ChatEvent();
    constructor() { }
    register = ({ socket, io }) => {
        this.chatEvent.sayHi({ socket, io });
        this.chatEvent.sendMessage({ socket, io });
    };
}
exports.ChatGateway = ChatGateway;
