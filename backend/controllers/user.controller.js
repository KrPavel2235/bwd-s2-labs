import { createUsers, createUserCheck } from "../services/user.service.js";
import { BadRequestError, NotFoundError } from "../config/error.js";
import User from "../models/User.js";

const userController = {
  async getAllUsers(req, res, next) {
      try {
          const users = await User.findAll();
          res.json(users);
      } catch (err) {
          next(err);
      }
  },

  async findByEmail(email){
    return await User.findOne({ where: { email } });
  },

  async getUserById(req, res, next) {
      try {
          const { id } = req.params;
          const user = await User.findByPk(id);

          if (!user) {
              throw new NotFoundError('Пользователь не найден');
          }

          res.json(user);
      } catch (err) {
          next(err);
      }
  },

  // Создать новое событие
  async createUser(req, res, next) {
      try {
          const { name, email } = req.body;

          if (!name || !email ) {
              throw new BadRequestError('У пользователя должны быть имя и почта!');
          }

          await createUserCheck(email);

          const newUser = await createUsers(name,email);
          res.status(201).json(newUser);
      } catch (err) {
          next(err);
      }
  },

  // Обновить событие
  async updateUser(req, res, next) {
      try {
          const { id } = req.params;
          const { name, email } = req.body;

          const user = await User.findByPk(id);
          if (!user) {
              throw new NotFoundError('Пользователь не найден');
          }

          await user.update({ name, email });
          res.json(user);
      } catch (err) {
          next(err);
      }
  },

  // Удалить событие
  async deleteUser(req, res, next) {
      try {
          const { id } = req.params;
          const user = await User.findByPk(id);

          if (!user) {
              throw new NotFoundError('Пользователь не найден');
          }

          await user.destroy();
          res.json({ message: 'Пользовател ЛИКВИДИРОВАН >=)' });
      } catch (err) {
          next(err);
      }
  }
};

export default userController;