import type { Request, Response } from "express";
import { BadRequestException } from "../../utils";

class AuthService {
  constructor() {}

  register = (req: Request, res: Response) => {
    return res.status(201).json({
      message: "User registered successfully",
      user: { ...req.body },
    });
  };
  login = (req: Request, res: Response) => {};
}

export default new AuthService();
