import { NextFunction, Request, Response } from "express";
import { IError } from "../utils/response";
import { NODE_ENV } from "../config/env";

const errorMiddleware = (
  error: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
    success: false,
    cause: error.cause ? error.cause : undefined,
    stack: NODE_ENV === "development" ? error.stack : undefined,
  });
};
export default errorMiddleware;
