import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Events.module.css';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  userId: number;
}

interface User {
  name: string;
  email: string;
  id: number;
}

const Events: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/events', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка загрузки мероприятий');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке мероприятий');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Мероприятия</h1>
        <div className={styles.userInfo}>
          <span>Привет, {user?.name}!</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Выйти
          </button>
        </div>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.eventsGrid}>
        {events.map(event => (
          <div key={event.id} className={styles.eventCard}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <div className={styles.eventDetails}>
              <span>Дата: {new Date(event.date).toLocaleDateString()}</span>
              <span>Место: {event.place}</span>
              <span>Координаты: {event.location}</span>
            </div>
            <YMaps>
              <div className={styles.mapContainer}>
                <Map
                  defaultState={{
                    center: event.location.split(',').map(coord => parseFloat(coord.trim())),
                    zoom: 12,
                  }}
                  width="100%"
                  height="200px"
                >
                  <Placemark
                    geometry={event.location.split(',').map(coord => parseFloat(coord.trim()))}
                    properties={{
                      balloonContent: event.title,
                    }}
                  />
                </Map>
              </div>
            </YMaps>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
