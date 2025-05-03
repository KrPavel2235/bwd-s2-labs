import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent } from '../store/slices/eventsSlice';
import { CreateEventData } from '../api/events';
import styles from './CreateEventForm.module.css';
import { AppDispatch } from '../store';

const CreateEventForm: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    date: '',
    place: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createEvent(formData)).unwrap();
      setFormData({
        title: '',
        description: '',
        date: '',
        place: '',
        location: '',
      });
    } catch (error) {
      console.error('Ошибка при создании мероприятия:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Название</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="date">Дата</label>
        <input
          type="datetime-local"
          id="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="place">Место</label>
        <input
          type="text"
          id="place"
          value={formData.place}
          onChange={(e) => setFormData({ ...formData, place: e.target.value })}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="location">Координаты (широта, долгота)</label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Например: 55.751244, 37.618423"
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Создать мероприятие
      </button>
    </form>
  );
};

export default CreateEventForm;
