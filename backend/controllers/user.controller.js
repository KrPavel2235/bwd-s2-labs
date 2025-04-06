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

  async findByEmail(email) {
    try {
        console.log(`Searching for user with email: ${email}`);
        const user = await User.findOne({ where: { email } });
        console.log(`User found: ${user}`);
        return user;
    } catch (err) {
        console.error(`Error finding user by email: ${err}`);
        next(err);
    }
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
          const { name, email, password } = req.body;

          if (!name || !email || !password ) {
              throw new BadRequestError('У пользователя должны быть имя почта и пароль!');
          }

          console.log(`Creating user with name: ${name}, email: ${email}`);
          await createUserCheck(email);

          const newUser = await createUsers(name,email,password);
          console.log(`User created: ${JSON.stringify(newUser)}`);
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