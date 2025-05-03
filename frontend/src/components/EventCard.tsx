import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { participateInEvent, unsubscribeFromEvent } from '../store/slices/eventsSlice';
import { Event } from '../api/events';
import { RootState } from '../store';
import ParticipantsModal from './ParticipantsModal';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { YANDEX_MAPS_API_KEY } from '../config/yandexMaps';
import styles from './EventCard.module.css';
import { AppDispatch } from '../store';

interface EventCardProps {
  event: Event;
}

export const EventCard: FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [showParticipants, setShowParticipants] = useState(false);

  const handleUnsubscribe = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите отписаться от этого мероприятия?')) {
      try {
        await dispatch(unsubscribeFromEvent(event.id)).unwrap();
      } catch (error) {
        console.error('Ошибка при отписке от мероприятия:', error);
      }
    }
  };

  const handleParticipate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await dispatch(participateInEvent(event.id)).unwrap();
    } catch (error) {
      console.error('Ошибка при записи на мероприятие:', error);
    }
  };

  const isParticipating = currentUser?.id && event.userIDs.includes(currentUser.id);
  const isEventCreator = currentUser?.id === event.userIDs[0];

  console.log('=== DEBUG INFO FOR EVENT CARD ===');
  console.log('Текущий пользователь:', currentUser);
  console.log('ID текущего пользователя:', currentUser?.id);
  console.log('ID участников мероприятия:', event.userIDs);
  console.log('Участвует ли пользователь:', isParticipating);
  console.log('Является ли создателем:', isEventCreator);
  console.log('Должна ли отображаться кнопка:', currentUser && !isParticipating);
  console.log('ID мероприятия:', event.id);
  console.log('================================');

  return (
    <>
      <div className={styles.card} onClick={() => navigate(`/events/${event.id}`)}>
        <div className={styles.content}>
          <h3 className={styles.title}>{event.title}</h3>
          <p className={styles.description}>{event.description}</p>
          <div className={styles.details}>
            <span className={styles.date}>{new Date(event.date).toLocaleDateString()}</span>
            <span className={styles.location}>{event.location}</span>
          </div>
          <div className={styles.participantsSection}>
            <span 
              className={styles.participantsCount}
              onClick={(e) => {
                e.stopPropagation();
                setShowParticipants(true);
              }}
            >
              Участников: {event.userIDs.length}
            </span>
            {currentUser && !isParticipating && !isEventCreator && (
              <button 
                className={styles.participateButton}
                onClick={handleParticipate}
              >
                Записаться
              </button>
            )}
            {isParticipating && !isEventCreator && (
              <button 
                className={styles.unsubscribeButton}
                onClick={handleUnsubscribe}
              >
                Отписаться
              </button>
            )}
            {isParticipating && (
              <span className={styles.participatingText}>Вы записаны</span>
            )}
          </div>
          <YMaps query={{ apikey: YANDEX_MAPS_API_KEY }}>
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
      </div>
      {showParticipants && (
        <ParticipantsModal
          participants={event.participants}
          onClose={() => setShowParticipants(false)}
        />
      )}
    </>
  );
};
