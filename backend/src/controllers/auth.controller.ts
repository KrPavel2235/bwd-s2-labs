import { Request, Response, NextFunction } from 'express';
import authService from '@services/auth.service';
import { BadRequestError } from '@config/error';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

class AuthController {
  async registerUser(
    req: Request<Record<string, never>, Record<string, never>, RegisterRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new BadRequestError('Все обязательные поля должны быть заполнены');
      }

      const user = await authService.registerUser(name, email, password);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async loginUser(
    req: Request<Record<string, never>, Record<string, never>, LoginRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new BadRequestError('Email и пароль обязательны');
      }

      const tokens = await authService.loginUser(email, password);
      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
