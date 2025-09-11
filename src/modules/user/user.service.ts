import type { NextFunction, Request, Response } from "express";
import { createLoginCredentials, createRevokeToken } from "../../utils/tokens";
import { HydratedUserDoc } from "../../database/models/user.model";
import type { JwtPayload } from "jsonwebtoken";

class UserService {
  constructor() {}

  // get me
  me = (req: Request, res: Response, next: NextFunction): Response => {
    return res.status(200).json({
      message: "User Retrieved Successfully",
      data: { user: req.user, decoded: req.decoded },
    });
  };
  // refresh token
  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const credentials = createLoginCredentials(req.user as HydratedUserDoc);
    await createRevokeToken({ decoded: req?.decoded as JwtPayload });

    return res.status(201).json({
      message: "Token refreshed successfully",
      data: {
        credentials,
      },
    });
  };
}
export default new UserService();
