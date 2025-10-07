import { ILoginResponse } from "../auth";

export interface IRefreshTokenResponse extends ILoginResponse {}
export interface IUpdateProfileImageResponse {
  key: string;
  url: string;
}