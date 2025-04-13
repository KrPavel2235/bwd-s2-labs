import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError, ForbiddenError } from '../config/error.js';

interface ErrorResponse {
  message: string;
  status: number;
  errors?: string[];
}

const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let errorResponse: ErrorResponse = {
    message: 'Internal Server Error',
    status: 500,
  };

  if (err instanceof BadRequestError) {
    errorResponse = {
      message: err.message,
      status: 400,
      errors: err.errors,
    };
  } else if (err instanceof NotFoundError) {
    errorResponse = {
      message: err.message,
      status: 404,
    };
  } else if (err instanceof ForbiddenError) {
    errorResponse = {
      message: err.message,
      status: 403,
    };
  }

  res.status(errorResponse.status).json(errorResponse);
};

export default errorMiddleware; 