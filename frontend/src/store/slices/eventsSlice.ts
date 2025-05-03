import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { createEvent as createEventApi, CreateEventData, Event, updateEvent as updateEventApi, UpdateEventData, participateInEvent as participateInEventApi } from '../../api/events';
import { getFromStorage } from '../../utils/storage';

interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  filters: {
    category: string;
    date: string;
    location: string;
  };
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  currentEvent: null,
  status: 'idle',
  filters: {
    category: '',
    date: '',
    location: '',
  },
  error: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const token = getFromStorage<string>('token');
      if (!token) {
        throw new Error('Не авторизован');
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

      return response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка загрузки мероприятий');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: CreateEventData, { rejectWithValue }) => {
    try {
      const token = getFromStorage<string>('token');
      if (!token) {
        throw new Error('Не авторизован');
      }

      const response = await fetch('/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания мероприятия');
      }

      return response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка создания мероприятия');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, eventData }: { id: number; eventData: UpdateEventData }, { rejectWithValue }) => {
    try {
      const token = getFromStorage<string>('token');
      if (!token) {
        throw new Error('Не авторизован');
      }

      const response = await fetch(`/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка обновления мероприятия');
      }

      return response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка обновления мероприятия');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = getFromStorage<string>('token');
      if (!token) {
        throw new Error('Не авторизован');
      }

      const response = await fetch(`/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка удаления мероприятия');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка удаления мероприятия');
    }
  }
);

export const participateInEvent = createAsyncThunk(
  'events/participateInEvent',
  async (eventId: number, { rejectWithValue }) => {
    try {
      const token = getFromStorage<string>('token');
      if (!token) {
        throw new Error('Не авторизован');
      }

      const response = await fetch(`/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка участия в мероприятии');
      }

      return response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка участия в мероприятии');
    }
  }
);

export const unsubscribeFromEvent = createAsyncThunk(
  'events/unsubscribeFromEvent',
  async (eventId: number, { rejectWithValue }) => {
    try {
      const token = getFromStorage<string>('token');
      if (!token) {
        throw new Error('Не авторизован');
      }

      const response = await fetch(`/events/${eventId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при отписке от мероприятия');
      }

      return response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка при отписке от мероприятия');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = state.events.filter(event => event.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(participateInEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(participateInEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(participateInEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(unsubscribeFromEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(unsubscribeFromEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(unsubscribeFromEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setFilters } = eventsSlice.actions;

export const selectEvents = (state: RootState) => state.events;

export default eventsSlice.reducer;
