import type { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../../config/env";

export interface IError extends Error {
  statusCode: number;
}

export class AppException extends Error {
  constructor(
    message: string,
    public statusCode: number,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

const errorHandler = (
  error: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
    success: false,
    error: Object.keys(error).length > 0 ? error : undefined,
    stack: NODE_ENV === "development" ? error.stack : undefined,
  });
};
export default errorHandler;
