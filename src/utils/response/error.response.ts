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
