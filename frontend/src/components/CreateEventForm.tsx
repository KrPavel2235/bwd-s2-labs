import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { createEvent } from '../store/slices/eventsSlice';
import styles from './CreateEventForm.module.css';

interface CreateEventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    place: '',
    location: '',
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
      await dispatch(createEvent(formData)).unwrap();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Ошибка уже обрабатывается в slice
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Создать мероприятие</h2>

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
          Создать
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

export default CreateEventForm;
