import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAuth } from '../../store/slices/authSlice';
import { selectProfile, fetchUserEvents } from '../../store/slices/profileSlice';
import { deleteEvent } from '../../store/slices/eventsSlice';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import EditEventForm from '../../components/EditEventForm';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { userEvents, loading, error } = useAppSelector(selectProfile);
  const [editingEvent, setEditingEvent] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(fetchUserEvents(user.id));
  }, [navigate, dispatch, user]);

  const handleRetry = () => {
    if (user?.id) {
      dispatch(fetchUserEvents(user.id));
    }
  };

  const handleDelete = async (eventId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      try {
        await dispatch(deleteEvent(eventId)).unwrap();
      } catch (error) {
        console.error('Ошибка при удалении мероприятия:', error);
      }
    }
  };

  const handleEditSuccess = () => {
    setEditingEvent(null);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка профиля...</div>;
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate('/events')}>
        ← Вернуться к списку мероприятий
      </button>
      <header className={styles.header}>
        <h1>Профиль пользователя</h1>
      </header>

      <div className={styles.userInfo}>
        <h2>Информация о пользователе</h2>
        <div className={styles.infoItem}>
          <span className={styles.label}>Имя:</span>
          <span className={styles.value}>{user?.name}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{user?.email}</span>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={handleRetry} className={styles.retryButton}>
            Повторить попытку
          </button>
        </div>
      )}

      <div className={styles.eventsSection}>
        <h2>Мои мероприятия</h2>
        {userEvents.length === 0 && !error && (
          <div className={styles.noEvents}>У вас пока нет созданных мероприятий</div>
        )}
        <div className={styles.eventsGrid}>
          {userEvents.map(event => (
            <div key={event.id} className={styles.eventCard}>
              {editingEvent === event.id ? (
                <EditEventForm
                  event={event}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingEvent(null)}
                />
              ) : (
                <>
                  <div className={styles.eventActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => setEditingEvent(event.id)}
                    >
                      Редактировать
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(event.id)}
                    >
                      Удалить
                    </button>
                  </div>
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
                        />
                      </Map>
                    </div>
                  </YMaps>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
