import { getFromStorage } from '../utils/storage';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
  location: string;
  userIDs: number[];
  participants: {
    id: number;
    name: string;
  }[];
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  place: string;
  location: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  date?: string;
  place?: string;
  location?: string;
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

  const response = await fetch(`/events/${id}`, {
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

/**
 * Update event
 * @param id - Event ID
 * @param eventData - Event data
 * @returns Promise with updated event
 */
export const updateEvent = async (id: number, eventData: UpdateEventData): Promise<Event> => {
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
};

/**
 * Delete event
 * @param id - Event ID
 * @returns Promise with void
 */
export const deleteEvent = async (id: number): Promise<void> => {
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
};

/**
 * Participate in event
 * @param eventId - Event ID
 * @returns Promise with updated event
 */
export const participateInEvent = async (eventId: number): Promise<Event> => {
  const token = getFromStorage<string>('token');

  if (!token) {
    throw new Error('Не авторизован');
  }

  const response = await fetch(`/events/${eventId}/participate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка записи на мероприятие');
  }

  return response.json();
};
