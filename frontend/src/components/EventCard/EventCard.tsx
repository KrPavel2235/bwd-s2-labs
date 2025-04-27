import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteEvent } from '../../store/slices/eventsSlice';
import { Event } from '../../types/event';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: Event;
  onDelete?: () => void;
}

export const EventCard: FC<EventCardProps> = ({ event, onDelete }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      try {
        await dispatch(deleteEvent(event.id)).unwrap();
        onDelete?.();
      } catch (error) {
        console.error('Ошибка при удалении мероприятия:', error);
      }
    }
  };

  return (
    <div className={styles.card} onClick={() => navigate(`/events/${event.id}`)}>
      <button className={styles.deleteButton} onClick={handleDelete}>
        ×
      </button>
      <img src={event.image} alt={event.title} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.description}>{event.description}</p>
        <div className={styles.details}>
          <span className={styles.date}>{new Date(event.date).toLocaleDateString()}</span>
          <span className={styles.location}>{event.location}</span>
        </div>
      </div>
    </div>
  );
};
