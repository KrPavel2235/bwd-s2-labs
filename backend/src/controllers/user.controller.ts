import { Request, Response, NextFunction } from 'express';
import { createUsers, createUserCheck } from '@services/user.service';
import { BadRequestError, NotFoundError } from '@config/error';
import { User } from '@models/User';

interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
}

interface UpdateRoleRequest {
  role: 'user' | 'admin';
}

const userController = {
  async getAllUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.findAll();
      const usersWithoutPassword = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }));
      res.json(usersWithoutPassword);
    } catch (err) {
      next(err);
    }
  },

  async findByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    return user;
  },

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      res.json(userResponse);
    } catch (err) {
      next(err);
    }
  },

  async getUserByIdWithoutRequest(id: number): Promise<UserResponse> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },

  async createUser(
    req: Request<Record<string, never>, Record<string, never>, CreateUserRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new BadRequestError('У пользователя должны быть имя почта и пароль!');
      }

      await createUserCheck(email);

      const newUser = await createUsers(name, email, password);
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  },

  async createUserWithoutRequest(
    name: string,
    email: string,
    password: string
  ): Promise<UserResponse> {
    console.log('Starting createUserWithoutRequest with:', { name, email });

    if (!name || !email || !password) {
      console.log('Missing required fields');
      throw new BadRequestError('У пользователя должны быть имя почта и пароль!');
    }

    console.log('Checking if user exists...');
    await createUserCheck(email);
    console.log('User does not exist, proceeding with creation');

    console.log('Creating user in database...');
    const newUser = await createUsers(name, email, password);

    const userResponse: UserResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    console.log('User created successfully:', userResponse);
    return userResponse;
  },

  async updateUser(
    req: Request<{ id: string }, Record<string, never>, UpdateUserRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      await user.update({
        name: name || user.name,
        email: email || user.email,
      });

      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      res.json(userResponse);
    } catch (err) {
      next(err);
    }
  },

  async deleteUser(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      await user.destroy();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async updateUserRole(
    req: Request<{ id: string }, Record<string, never>, UpdateRoleRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      await user.update({ role });

      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      res.json(userResponse);
    } catch (err) {
      next(err);
    }
  },
};

export default userController;
