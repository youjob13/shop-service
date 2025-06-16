import { HTTP_STATUS } from '../http/constants.js';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    public error?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
  }
}
