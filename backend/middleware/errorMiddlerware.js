import { CustomError } from '../config/error.js';

function errorMiddleware(err, req, res, next) {
    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Внутренняя ошибка сервера';
    let errors = [];

    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Ошибки валидации Sequelize
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 400;
        message = 'Ошибка валидации данных';
        errors = err.errors?.map(e => e.message) || [];
    }

    // Ошибка, если запись уже существует (уникальное ограничение в БД)
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Дублирующиеся данные';
        errors.push('Запись с такими данными уже существует.');
    }

    // Ошибка авторизации (например, если токен невалиден)
    if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Не авторизован';
    }

    res.status(statusCode).json({
        error: {
            message: message,
            errors: errors.length ? errors : undefined,
        },
    });
}

export default errorMiddleware;
