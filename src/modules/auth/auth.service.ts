import type { Request, Response } from "express";
import { BadRequestException } from "../../utils";

class AuthService {
  constructor() {}

  register = (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    throw new BadRequestException("Invalid user data", {
      
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: "generated-user-id",
        username,
        email,
        password
      },
    });
  };
  login = (req: Request, res: Response) => {};
}

export default new AuthService();
