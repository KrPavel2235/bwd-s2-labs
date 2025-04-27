import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: {
    message: string;
    type: 'success' | 'error' | 'info';
  }[];
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((_, index) => index !== action.payload);
    },
  },
});

export const { toggleTheme, toggleSidebar, addNotification, removeNotification } = uiSlice.actions;
export const selectUI = (state: RootState) => state.ui;
export default uiSlice.reducer;
