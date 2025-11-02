import { HydratedChatDoc } from "../../database/models";

export interface IGetChatResponse {
  chat: Partial<HydratedChatDoc>;
}
