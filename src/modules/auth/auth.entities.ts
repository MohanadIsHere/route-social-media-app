export interface ILoginResponse {
  credentials: {
    accessToken: string;
    refreshToken: string;
  };
}
export interface IRegisterWithGmailResponse extends ILoginResponse {}