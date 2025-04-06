import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userController from "../controllers/user.controller.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../config/error.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET не задан в переменных окружения");
}

class AuthService {
  async registerUser(name, email, password) {
    const existingUser = await userController.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError("Пользователь с таким email уже существует");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await userController.createUser(name, email, hashedPassword);
  }

  async loginUser(email, password) {
    const user = await userController.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Неверный email или пароль");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Неверный email или пароль");
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET
    );

    return { accessToken };
  }

}

export default new AuthService();