import { IMainDto } from "../../gateway";
import { z } from "zod";
import * as validators from "../chat.validation";

export interface ISayHiDto extends IMainDto {
  message: string;
}
export interface ISendMessageDto extends IMainDto {
  content: string;
  sendTo: string;
}
export type IGetChatParamsDto = z.infer<
  typeof validators.getChatValidationSchema.params
>;
