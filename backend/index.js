// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerSetup from './config/swagger.js';
import sequelize, { testDatabaseConnection } from './config/db.js';
import { User, Event } from './models/index.js';
import { ValidationError, NotFoundError } from './config/error.js';
import errorMiddlerware from './middleware/errorMiddlerware.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());



testDatabaseConnection();

// Обработка ошибок
app.use(errorMiddlerware);

app.use("/", router);

// todo документация свагера к каждому маршруту


// Подключение Swagger
swaggerSetup(app);

// Определяем порт
const PORT = process.env.PORT || 3000;

// Запускаем сервер и настраиваем обработку ошибок
const server = app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

// Обработка ошибок при запуске сервера
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Порт ${PORT} уже занят. Попробуй использовать другой порт.`);
  } else {
    console.error('Произошла ошибка при запуске сервера:', error);
  }
});

// Синхронизация моделей с базой данных todo db
async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // { force: true } для разработки
    console.log('База данных успешно синхронизирована.');
  } catch (error) {
    console.error('Ошибка синхронизации базы данных:', error);
  }
}

syncDatabase();