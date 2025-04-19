import authService from "../services/auth.service.js";
import { BadRequestError } from "../config/error.js";

class AuthController {
  async registerUser(req, res, next) {
    console.log("итак я тут запускаюсь");
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new BadRequestError("Все обязательные поля должны быть заполнены");
      }

      const user = await authService.registerUser(name, email, password);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  async loginUser(req, res, next){
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new BadRequestError("Email и пароль обязательны");
      }

      const tokens = await authService.loginUser(email, password);
      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();