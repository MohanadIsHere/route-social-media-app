import type { Request, Response } from "express";
import { RegisterBodyDto } from "./dto";

class AuthService {
  constructor() {}

  register = (req: Request, res: Response): Response => {
    const { username, email, password }: RegisterBodyDto = req.body;

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        username,
        email,
        password
      },
    });
  };
  login = (req: Request, res: Response) => {};
}

export default new AuthService();
