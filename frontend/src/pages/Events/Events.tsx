import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAuth, logout } from '../../store/slices/authSlice';
import { selectEvents, fetchEvents } from '../../store/slices/eventsSlice';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import CreateEventForm from '../../components/CreateEventForm';
import styles from './Events.module.css';
import { Event } from '../../api/events';

const Events: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { events, loading, error } = useAppSelector(selectEvents);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(fetchEvents());
  }, [navigate, dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleCreateSuccess = () => {
    setIsCreating(false);
    dispatch(fetchEvents());
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка мероприятий...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Мероприятия</h1>
        <div className={styles.userInfo}>
          <span>Привет, {user?.name}!</span>
          <div className={styles.buttons}>
            <button onClick={handleProfileClick} className={styles.profileButton}>
              Профиль
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Выйти
            </button>
          </div>
        </div>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        {!isCreating && (
          <button onClick={() => setIsCreating(true)} className={styles.createButton}>
            Создать мероприятие
          </button>
        )}
      </div>

      {isCreating && (
        <div className={styles.createFormContainer}>
          <CreateEventForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreating(false)} />
        </div>
      )}

      <div className={styles.eventsGrid}>
        {events.map((event: Event) => (
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
                    center: event.location
                      .split(',')
                      .map((coord: string) => parseFloat(coord.trim())),
                    zoom: 12,
                  }}
                  width="100%"
                  height="200px"
                >
                  <Placemark
                    geometry={event.location
                      .split(',')
                      .map((coord: string) => parseFloat(coord.trim()))}
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
