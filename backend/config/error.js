// Базовый класс для кастомных ошибок
class CustomError extends Error {
  constructor(message, statusCode, name) {
      super(message);
      this.name = name || 'CustomError';
      this.statusCode = statusCode || 500;
  }
}

// Ошибка валидации
class ValidationError extends CustomError {
  constructor(message) {
      super(message, 400, 'ValidationError');
  }
}

// Ошибка "Не найдено"
class NotFoundError extends CustomError {
  constructor(message) {
      super(message, 404, 'NotFoundError');
  }
}

export { CustomError, ValidationError, NotFoundError };