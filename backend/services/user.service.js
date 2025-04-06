import User from '../models/User.js'; // Импортируем модель User
import { CustomError } from '../config/error.js';
export async function createUserCheck(email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new CustomError('Пользователь с таким email уже существует');
    }
}

export async function createUsers(name, email) {
    const user = await User.create({ name, email });
    return user;
}