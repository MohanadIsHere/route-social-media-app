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
export class ConflictException extends AppException {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 409, options);
    this.name = this.constructor.name;
  }
}
