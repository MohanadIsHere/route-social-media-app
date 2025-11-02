import { HydratedChatDoc, HydratedUserDoc } from "../../database/models";
import { ILoginResponse } from "../auth";

export interface IRefreshTokenResponse extends ILoginResponse {}
export interface IUpdateProfileImageResponse {
  key: string;
  url: string;
}
export interface IGetProfileResponse {
  user: Partial<HydratedUserDoc>;
  groups?: HydratedChatDoc[] | [];
}