import { createUsers, createUserCheck } from "../services/user.service.js";
import { ValidationError, NotFoundError } from "../config/error.js";
import User from "../models/User.js";

export async function createUser(req, res, next) {
    try {
        const { name, email } = req.body;
    
        if (!name || !email) {
          throw new ValidationError('Необходимо указать name и email')
        }

        await createUserCheck(name, email);

        const user = await createUsers(name,email);
        res.status(201).json(user);
      } catch (error) {
        next(error);
      }
}

export async function getAllUsers(req, res, next) {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
      } catch (error) {
        next(error)
      }
}

export async function getByIdUser(req,res,next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function putByIdUser(req,res,next) {
  try {
    const { name, email } = req.body;

    if (!name || !email ) {
      throw new ValidationError('Необходимо указать name email');
    }

    const user = await Event.findByPk(req.params.id);
    if (!name) {
      throw new NotFoundError('Пользователь не найден');
    }

    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
}

export async function deleteByIdUser(req,res,next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new NotFoundError('Пользователь не найдено');
    }

    await user.destroy();
    res.status(200).json({ message: 'Пользователь успешно удалён' });
  } catch (error) {
    next(error);
  }
}