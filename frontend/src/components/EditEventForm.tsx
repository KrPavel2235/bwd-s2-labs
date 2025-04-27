import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { updateEvent } from '../store/slices/eventsSlice';
import { Event } from '../api/events';
import styles from './CreateEventForm.module.css';

interface EditEventFormProps {
  event: Event;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditEventForm: React.FC<EditEventFormProps> = ({ event, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    place: event.place,
    location: event.location,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateEvent(formData)).unwrap();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Ошибка уже обрабатывается в slice
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Редактировать мероприятие</h2>

      <div className={styles.formGroup}>
        <label htmlFor="title">Название:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Описание:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="date">Дата:</label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="place">Место:</label>
        <input
          type="text"
          id="place"
          name="place"
          value={formData.place}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="location">Координаты:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          placeholder="55.7558, 37.6173"
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.buttons}>
        <button type="submit" className={styles.submitButton}>
          Сохранить
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default EditEventForm; 