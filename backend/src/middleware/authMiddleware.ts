import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ForbiddenError } from '@config/error';

interface UserRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const authMiddleware = (req: UserRequest, _res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ForbiddenError('Требуется авторизация');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    throw new ForbiddenError('Недействительный токен');
  }
};

export default authMiddleware;
