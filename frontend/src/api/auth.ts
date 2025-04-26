import { saveToStorage, removeFromStorage } from '../utils/storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка авторизации');
  }

  const data = await response.json();
  saveToStorage('user', data.user);
  saveToStorage('token', data.token);
  return data;
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка регистрации');
  }

  const data = await response.json();
  saveToStorage('user', data.user);
  saveToStorage('token', data.token);
  return data;
};

export const logout = (): void => {
  removeFromStorage('user');
  removeFromStorage('token');
};
