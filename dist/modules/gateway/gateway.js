"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.initializeIo = void 0;
const socket_io_1 = require("socket.io");
const tokens_1 = require("../../utils/tokens");
const chat_1 = require("../chat");
const response_1 = require("../../utils/response");
const connectedSockets = new Map();
let io = undefined;
const initializeIo = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            credentials: true,
        },
    });
    io.use(async (socket, next) => {
        try {
            const { user, decoded } = await (0, tokens_1.decodeToken)({
                authorization: socket.handshake.auth.authorization || "",
                tokenType: tokens_1.TokenEnum.access,
            });
            const userTabs = connectedSockets.get(user._id.toString()) || [];
            userTabs.push(socket.id);
            connectedSockets.set(user._id.toString(), userTabs);
            socket.credentials = { user, decoded };
            next();
        }
        catch (error) {
            next(error);
        }
    });
    function disconnect(socket) {
        return socket.on("disconnect", () => {
            const userId = socket.credentials?.user._id?.toString();
            let remainingTabs = connectedSockets.get(userId)?.filter((tab) => {
                return tab !== socket.id;
            }) || [];
            if (remainingTabs.length) {
                connectedSockets.set(userId, remainingTabs);
            }
            else {
                connectedSockets.delete(userId);
                (0, exports.getIo)().emit("offline_user", { disconnectedUserId: userId });
            }
        });
    }
    const chatGateway = new chat_1.ChatGateway();
    io.on("connection", (socket) => {
        chatGateway.register({ socket, io: (0, exports.getIo)() });
        disconnect(socket);
    });
};
exports.initializeIo = initializeIo;
const getIo = () => {
    if (!io)
        throw new response_1.BadRequestException("Fail to get io instance");
    return io;
};
exports.getIo = getIo;
