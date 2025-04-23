import { Response } from 'express';

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class BadRequestError extends CustomError {
  errors?: string[];

  constructor(message = 'Некорректный запрос', errors?: string[]) {
    super(message, 400);
    this.errors = errors;
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = 'Неавторизованный доступ') {
    super(message, 401);
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Ресурс не найден') {
    super(message, 404);
  }
}

class InternalServerError extends CustomError {
  constructor(message = 'Внутренняя ошибка сервера') {
    super(message, 500);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = 'Неверный JWT ключ') {
    super(message, 403);
  }
}

const handleError = (res: Response, error: Error | CustomError, defaultMessage?: string): void => {
  const statusCode = (error as CustomError).statusCode || 500;
  res.status(statusCode).json({ error: error.message || defaultMessage });
};

export {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
  handleError,
};
