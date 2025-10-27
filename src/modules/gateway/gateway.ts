import { Server as httpServer } from "node:http";
import { Server } from "socket.io";
import { decodeToken, TokenEnum } from "../../utils/tokens";
import type { IAuthSocket } from "./gateway.interface";
import { ChatGateway } from "../chat";
import { BadRequestException } from "../../utils/response";

const connectedSockets = new Map<string, string[]>();
let io: undefined | Server = undefined;
export const initializeIo = (httpServer: httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      credentials: true,
    },
  });
  // Middleware to authenticate socket connection
  io.use(async (socket: IAuthSocket, next) => {
    try {
      const { user, decoded } = await decodeToken({
        authorization: socket.handshake.auth.authorization || "",
        tokenType: TokenEnum.access,
      });
      // console.log({user,decoded});
      const userTabs = connectedSockets.get(user._id.toString()) || [];
      userTabs.push(socket.id);

      connectedSockets.set(user._id.toString(), userTabs);
      socket.credentials = { user, decoded };
      next();
    } catch (error: any) {
      next(error);
    }
  });
  function disconnect(socket: IAuthSocket) {
    return socket.on("disconnect", () => {
      const userId = socket.credentials?.user._id?.toString() as string;
      let remainingTabs =
        connectedSockets.get(userId)?.filter((tab: string) => {
          return tab !== socket.id;
        }) || [];
      if (remainingTabs.length) {
        connectedSockets.set(userId, remainingTabs);
      } else {
        connectedSockets.delete(userId);
        getIo().emit("offline_user", { disconnectedUserId: userId });
      }
    });
  }
  const chatGateway: ChatGateway = new ChatGateway();
  // Handle socket connection
  io.on("connection", (socket: IAuthSocket) => {
    chatGateway.register({ socket, io: getIo() });
    disconnect(socket);
  });
};
export const getIo = (): Server => {
  if (!io) throw new BadRequestException("Fail to get io instance");
  return io;
};
