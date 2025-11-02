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
export interface ISendGroupMessageDto extends IMainDto {
  content: string;
  groupId: string;
}
export interface IJoinRoomDto extends IMainDto {
  roomId: string;
}
export type IGetChatParamsDto = z.infer<
  typeof validators.getChatValidationSchema.params
>;
export type IGetChatQueryDto = z.infer<
  typeof validators.getChatValidationSchema.query
>;
export type ICreateChattingGroupBodyDto = z.infer<
  typeof validators.createChattingGroupValidationSchema.body
>;
export type IGetChattingGroupParamsDto = z.infer<
  typeof validators.getChattingGroupValidationSchema.params
>;