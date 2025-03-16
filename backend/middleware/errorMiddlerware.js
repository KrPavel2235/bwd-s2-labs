import { ValidationError, NotFoundError } from '../config/error.js';

export default function (err, req, res, next) {
    console.error('Ошибка:', err); 

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            error: err.errors.map(e => e.message).join(', '), 
        });
    }

    if (err instanceof ValidationError || err instanceof NotFoundError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    res.status(500).json({ error: 'Что-то пошло не так' });
}