import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userController from '@controllers/user.controller';
import { BadRequestError, UnauthorizedError } from '@config/error';

interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  user: UserResponse;
}

interface TokenResponse {
  accessToken: string;
}

const JWT_SECRET = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET не задан в переменных окружения');
}

class AuthService {
  async registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
    const existingUser = await userController.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userController.createUserWithoutRequest(name, email, hashedPassword);

    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return { user: userResponse };
  }

  async loginUser(email: string, password: string): Promise<TokenResponse> {
    const user = await userController.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Неверный email или пароль');
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET);

    return { accessToken };
  }
}

export default new AuthService();
