import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@config/error';
import { User } from '@models/User';

export const isAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  const user = req.user as User;
  if (!user || user.role !== 'admin') {
    throw new ForbiddenError('Доступ запрещен. Требуются права администратора.');
  }
  next();
};

export const isUser = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new ForbiddenError('Доступ запрещен. Требуется авторизация.');
  }
  next();
};
