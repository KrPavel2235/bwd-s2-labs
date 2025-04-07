import User from '../models/User.js'; // Импортируем модель User
import { CustomError } from '../config/error.js';

export async function createUserCheck(email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new CustomError('Пользователь с таким email уже существует');
    }
}

export async function createUsers(name, email, password) {
    try {
        const user = await User.create({ name, email, password });
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        return userResponse;
    } catch (error) {
        throw error;
    }
}