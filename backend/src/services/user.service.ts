import { User } from '@models/User';
import { CustomError } from '@config/error';

interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export async function createUserCheck(email: string): Promise<void> {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new CustomError('Пользователь с таким email уже существует', 400);
  }
}

export async function createUsers(
  name: string,
  email: string,
  password: string
): Promise<UserResponse> {
  try {
    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
    });
    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return userResponse;
  } catch (error) {
    throw new CustomError('Ошибка при создании пользователя', 500);
  }
}
