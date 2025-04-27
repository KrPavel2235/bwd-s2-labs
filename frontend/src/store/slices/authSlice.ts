import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { saveToStorage, removeFromStorage } from '../../utils/storage';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
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
    const tokenData = JSON.parse(atob(data.accessToken.split('.')[1]));

    saveToStorage('token', data.accessToken);
    saveToStorage('user', {
      name: tokenData.name,
      email: tokenData.email,
      id: tokenData.id,
    });

    return {
      name: tokenData.name,
      email: tokenData.email,
      id: tokenData.id,
    };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      removeFromStorage('token');
      removeFromStorage('user');
    },
    clearError: state => {
      state.error = null;
    },
    restoreSession: state => {
      const userData = localStorage.getItem('user');
      if (userData) {
        state.user = JSON.parse(userData);
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка авторизации';
      });
  },
});

export const { logout, clearError, restoreSession } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
