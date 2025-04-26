import { getFromStorage } from '../utils/storage';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
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
