import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Home/Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Добро пожаловать</h1>
      <div className={styles.buttonContainer}>
        <Link to="/login" className={styles.button}>
          Авторизация
        </Link>
        <Link to="/register" className={styles.button}>
          Регистрация
        </Link>
        <Link to="/events" className={styles.button}>
          Список мероприятий
        </Link>
      </div>
    </div>
  );
};

export default Home;
