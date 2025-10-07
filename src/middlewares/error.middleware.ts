import { NextFunction, Request, Response } from "express";
import { IError } from "../utils/response";
import { NODE_ENV } from "../config/env";

const errorMiddleware = (
  error: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === "TokenExpiredError") {
    error.message = "Session expired, please login again";
    error.statusCode = 401;
  }
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
    success: false,
    statusCode:error.statusCode,
    cause: error.cause ? error.cause : undefined,
    stack: NODE_ENV === "development" ? error.stack : undefined,
  });
};
export default errorMiddleware;
