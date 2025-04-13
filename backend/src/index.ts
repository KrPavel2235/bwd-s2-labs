import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerSetup from './config/swagger.js';
import { syncDatabase, testDatabaseConnection } from './config/db.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import passport from './config/passport.js';
import router from './routes/router.js';
import authRoutes from './routes/authRoutes.js';
import morgan from 'morgan';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

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