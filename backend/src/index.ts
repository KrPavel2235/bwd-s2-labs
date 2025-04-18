import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerSetup from '@config/swagger';
import { syncDatabase, testDatabaseConnection } from '@config/database';
import errorMiddleware from '@middleware/errorMiddleware';
import passport from '@config/passport';
import router from '@routes/router';
import authRoutes from '@routes/authRoutes';
import morgan from 'morgan';
import { defineAssociations } from '@models/associations';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Инициализация моделей и их ассоциаций
defineAssociations();

// Инициализация базы данных
testDatabaseConnection()
  .then(() => syncDatabase(false))
  .catch((err: Error) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

// Инициализация Passport
app.use(passport.initialize());

// Маршруты
app.use('/auth', authRoutes);
app.use(router);

// Обработка ошибок
app.use(errorMiddleware);

// Подключение Swagger
swaggerSetup(app);

// Определяем порт
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Запускаем сервер и настраиваем обработку ошибок
const server = app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

// Обработка ошибок при запуске сервера
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Порт ${PORT} уже занят. Попробуй использовать другой порт.`);
  } else {
    console.error('Произошла ошибка при запуске сервера:', error);
  }
});
