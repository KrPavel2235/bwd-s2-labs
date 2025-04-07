import { createUsers, createUserCheck } from "../services/user.service.js";
import { BadRequestError, NotFoundError } from "../config/error.js";
import User from "../models/User.js";
//todo убрать пароли из json Ответов
const userController = {
  async getAllUsers(req, res, next) {
      try {
          const users = await User.findAll();
          const usersWithoutPassword = users.map(user => ({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
          }));
          res.json(usersWithoutPassword);
      } catch (err) {
          next(err);
      }
  },

  async findByEmail(email) {
    try {
        const user = await User.findOne({ where: { email } });
        return user;
    } catch (err) {
        throw err;
    }
},

  async getUserById(req, res, next) {
      try {
          const { id } = req.params;
          const user = await User.findByPk(id);

          if (!user) {
              throw new NotFoundError('Пользователь не найден');
          }
          
          const userResponse = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
          };
          res.json(userResponse);
      } catch (err) {
          next(err);
      }
  },

  async getUserByIdWithoutRequest(id) {
      try {
          const user = await User.findByPk(id);
          if (!user) {
              throw new NotFoundError('Пользователь не найден');
          }
          return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
          };
      } catch (err) {
          throw err;
      }
  },

  // Создать новое событие
  async createUser(req, res, next) {
      try {
          const { name, email, password } = req.body;

          if (!name || !email || !password ) {
              throw new BadRequestError('У пользователя должны быть имя почта и пароль!');
          }

          await createUserCheck(email);

          const newUser = await createUsers(name,email,password);
          res.status(201).json(newUser);
      } catch (err) {
          next(err);
      }
  },

  async createUserWithoutRequest(name, email, password) {
      try {
          console.log("Starting createUserWithoutRequest with:", { name, email });
          
          if (!name || !email || !password) {
              console.log("Missing required fields");
              throw new BadRequestError('У пользователя должны быть имя почта и пароль!');
          }

          console.log("Checking if user exists...");
          await createUserCheck(email);
          console.log("User does not exist, proceeding with creation");

          console.log("Creating user in database...");
          const newUser = await createUsers(name, email, password);
          
          const userResponse = {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role
          };
          
          console.log("User created successfully:", userResponse);
          return userResponse;
      } catch (err) {
          console.error('Error in createUserWithoutRequest:', err);
          throw err;
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
          const userResponse = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
          };
          res.json(userResponse);
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
  },

  async updateUserRole(req, res, next) {
      try {
          const { id } = req.params;
          const { role } = req.body;

          if (!['user', 'admin'].includes(role)) {
              throw new BadRequestError('Недопустимая роль пользователя');
          }

          const user = await User.findByPk(id);
          if (!user) {
              throw new NotFoundError('Пользователь не найден');
          }

          await user.update({ role });
          const userResponse = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
          };
          res.json({ message: 'Роль пользователя успешно обновлена', user: userResponse });
      } catch (err) {
          next(err);
      }
  }
};

export default userController;