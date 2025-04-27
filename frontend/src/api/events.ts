import { getFromStorage } from '../utils/storage';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
  location: string;
  userId: number;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  place: string;
  location: string;
}

/**
 * Get all events
 * @returns Promise with events array
 */
export const getEvents = async (): Promise<Event[]> => {
  const token = getFromStorage<string>('token');

  if (!token) {
    throw new Error('Не авторизован');
  }

  const response = await fetch('/api/events', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка загрузки мероприятий');
  }

  return response.json();
};

/**
 * Get event by ID
 * @param id - Event ID
 * @returns Promise with event
 */
export const getEventById = async (id: number): Promise<Event> => {
  const token = getFromStorage<string>('token');

  if (!token) {
    throw new Error('Не авторизован');
  }

  const response = await fetch(`/api/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка загрузки мероприятия');
  }

  return response.json();
};

/**
 * Create new event
 * @param eventData - Event data
 * @returns Promise with created event
 */
export const createEvent = async (eventData: CreateEventData): Promise<Event> => {
  const token = getFromStorage<string>('token');

  if (!token) {
    throw new Error('Не авторизован');
  }

  const response = await fetch('/events', {
    // фиксанул, маршрут был не очень
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
};
