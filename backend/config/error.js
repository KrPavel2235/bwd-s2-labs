class CustomError extends Error {
  constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
  }
}

class ValidationError extends CustomError {
  constructor(message = 'Некорректный запрос') {
      super(message, 400);
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

export { CustomError, ValidationError, InternalServerError, NotFoundError};