import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { createEvent as createEventApi, CreateEventData, Event, updateEvent as updateEventApi, UpdateEventData } from '../../api/events';
import { getFromStorage } from '../../utils/storage';

interface EventsState {
  events: Event[];
  filters: {
    category: string;
    date: string;
    location: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  filters: {
    category: '',
    date: '',
    location: '',
  },
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromStorage<string>('token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      const response = await fetch('/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка загрузки мероприятий');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки мероприятий'
      );
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: CreateEventData, { rejectWithValue }) => {
    try {
      const event = await createEventApi(eventData);
      return event;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка создания мероприятия'
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (eventId: number, { rejectWithValue }) => {
    try {
      const token = getFromStorage<string>('token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      const response = await fetch(`/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при удалении мероприятия');
      }

      return eventId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при удалении мероприятия'
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async (eventData: UpdateEventData, { rejectWithValue }) => {
    try {
      const event = await updateEventApi(eventData);
      return event;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка обновления мероприятия'
      );
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: state => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createEvent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(event => event.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = eventsSlice.actions;
export const selectEvents = (state: RootState): EventsState => state.events;
export default eventsSlice.reducer;
