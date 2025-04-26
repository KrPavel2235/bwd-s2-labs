import { useState, useEffect } from 'react';
import { Event, getEvents } from '../api/events';

interface EventsState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
}

export const useEvents = () => {
  const [state, setState] = useState<EventsState>({
    events: [],
    isLoading: true,
    error: null,
  });

  const fetchEvents = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const events = await getEvents();
      setState(prev => ({
        ...prev,
        events,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Произошла ошибка при загрузке мероприятий',
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events: state.events,
    isLoading: state.isLoading,
    error: state.error,
    refetch: fetchEvents,
  };
};
