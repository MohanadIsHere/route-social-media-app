import type { ISayHiDto } from "./dto";

export class ChatService {
  constructor() {}

  sayHi = ({ message, socket, callback, io }: ISayHiDto) => {
    try {
      console.log({ message });
      return callback ? callback(`Hello from BE to {${socket.id}}`) : undefined;
    } catch (error) {
      return socket.emit("custom_error", error);
    }
  };
}
