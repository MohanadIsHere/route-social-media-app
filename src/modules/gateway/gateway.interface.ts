import { Socket ,type Server} from "socket.io";
import type { HydratedUserDoc } from "../../database/models";
import type { JwtPayload } from "jsonwebtoken";

export interface IAuthSocket extends Socket {
  credentials?: {
    user: Partial<HydratedUserDoc>;
    decoded?: JwtPayload;
  };
}
export interface IMainDto {
  socket: IAuthSocket;
  callback?: any;
  io?: Server;
}