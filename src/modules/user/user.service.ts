import type { NextFunction, Request, Response } from "express";
import { createLoginCredentials, createRevokeToken } from "../../utils/tokens";
import { HydratedUserDoc } from "../../database/models/user.model";
import type { JwtPayload } from "jsonwebtoken";
import { SuccessResponse } from "../../utils/response";
import { createPreSignedUrl, uploadFile } from "../../utils/aws/S3";

class UserService {
  constructor() {}

  // get me
  me = (req: Request, res: Response, next: NextFunction): Response => {
    return SuccessResponse.ok({
      res,
      message: "User Retrieved Successfully",
      data: { user: req.user, decoded: req.decoded },
    });
  };
  // refresh token
  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const credentials = createLoginCredentials(req.user as HydratedUserDoc);
    await createRevokeToken({ decoded: req?.decoded as JwtPayload });

    return SuccessResponse.created({
      res,
      message: "Token refreshed successfully",
      data: {
        credentials,
      },
    });
  };

  updateProfileImage = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    // const key = await uploadFile({
    //   file: req.file as Express.Multer.File,
    //   path: `users/${req.decoded?.id}`,
    // });
    const {
      ContentType,
      originalname,
    }: { ContentType: string; originalname: string } = req.body;

    const { url, key } = await createPreSignedUrl({
      ContentType,
      originalname,
      path: `users/${req.decoded?.id}`,
    });

    return SuccessResponse.ok({
      res,
      data: { key, url },
      message: "Image uploaded successfully",
    });
  };
}
export default new UserService();
