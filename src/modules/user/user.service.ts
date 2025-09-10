import type { NextFunction, Request, Response } from "express";

class UserService {
  constructor() {}

  // get me
  me = (req: Request, res: Response, next: NextFunction): Response => {
    return res.status(200).json({
      message: "User Retrieved Successfully",
      data: { user: req.user, decoded: req.decoded  },
    });
  };
}
export default new UserService();
