import React from 'react';
import styles from './EventCard.module.css';

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  date,
  location,
  className = '',
}) => {
  return (
    <div className={`${styles.card} ${className}`}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.details}>
        <span className={styles.detail}>
          <strong>Дата:</strong> {new Date(date).toLocaleDateString()}
        </span>
        <span className={styles.detail}>
          <strong>Место:</strong> {location}
        </span>
      </div>
    </div>
  );
};

export default EventCard;
