import User from '../models/User.js'; // Импортируем модель User
import { CustomError } from '../config/error.js';

export async function createUserCheck(email) {
    console.log(`Checking if user with email: ${email} exists`);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        console.log(`User with email: ${email} already exists`);
        throw new CustomError('Пользователь с таким email уже существует');
    }
    console.log(`User with email: ${email} does not exist`);
}

export async function createUsers(name, email, password) {
    console.log(`Creating user with name: ${name}, email: ${email}, password: ${password}`);
    const user = await User.create({ name, email, password });
    console.log(`User created: ${JSON.stringify(user)}`);
    return user;
}