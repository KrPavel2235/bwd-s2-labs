import { ForbiddenError } from '../config/error.js';

export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ForbiddenError('Требуется аутентификация'));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ForbiddenError('Недостаточно прав для выполнения операции'));
        }

        next();
    };
};

export const isAdmin = checkRole(['admin']);
export const isUser = checkRole(['user', 'admin']); 