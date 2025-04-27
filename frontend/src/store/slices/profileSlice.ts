import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { fetchEvents } from './eventsSlice';

interface UserEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  place: string;
  userId: number;
}

interface ProfileState {
  userEvents: UserEvent[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  userEvents: [],
  loading: false,
  error: null,
};

export const fetchUserEvents = createAsyncThunk(
  'profile/fetchUserEvents',
  async (userId: number, { dispatch, getState }) => {
    try {
      // Сначала получаем все мероприятия
      await dispatch(fetchEvents());

      // Получаем все мероприятия из store
      const state = getState() as RootState;
      const allEvents = state.events.events;

      // Фильтруем мероприятия по userId
      return allEvents.filter(event => event.userId === userId);
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearUserEvents: state => {
      state.userEvents = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.userEvents = action.payload;
      })
      .addCase(fetchUserEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки мероприятий';
        state.userEvents = [];
      });
  },
});

export const { clearUserEvents } = profileSlice.actions;
export const selectProfile = (state: RootState) => state.profile;
export default profileSlice.reducer;
