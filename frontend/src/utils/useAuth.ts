import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFromStorage, saveToStorage, removeFromStorage } from './storage';
import { User, login as loginApi, register as registerApi, logout as logoutApi } from '../api/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const user = getFromStorage<User>('user');
    if (user) {
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await loginApi({ email, password });
      setState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      }));
      navigate('/events');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Произошла ошибка при авторизации',
        isLoading: false,
      }));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await registerApi({ name, email, password });
      setState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      }));
      navigate('/login');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Произошла ошибка при регистрации',
        isLoading: false,
      }));
    }
  };

  const logout = () => {
    logoutApi();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    navigate('/login');
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
  };
}; 