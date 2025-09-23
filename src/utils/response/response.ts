import type { Response } from "express";
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
export class BadRequestException extends AppException {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 400, options);
    this.name = this.constructor.name;
  }
}
export class NotFoundException extends AppException {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 404, options);
    this.name = this.constructor.name;
  }
}
export class UnauthorizedException extends AppException {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 401, options);
    this.name = this.constructor.name;
  }
}
export class ForbiddenException extends AppException {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 403, options);
    this.name = this.constructor.name;
  }
}
export class ConflictException extends AppException {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 409, options);
    this.name = this.constructor.name;
  }
}
export class SuccessResponse {
  static ok({
    res,
    message = "Success",
    statusCode = 200,
    data = {},
  }: {
    message?: string;
    res: Response;

    statusCode?: number;
    data?: object;
  }): Response {
    return res.status(statusCode).json({
      message,
      success: true,
      statusCode,
      data,
    });
  }
  static created({
    res,
    message = "Success",
    statusCode = 201,
    data = {},
  }: {
    message?: string;
    res: Response;

    statusCode?: number;
    data?: object;
  }): Response {
    return res.status(statusCode).json({
      message,
      success: true,
      statusCode,
      data,
    });
  }
}
