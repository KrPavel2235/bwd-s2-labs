import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerSetup from './config/swagger.js';
import { syncDatabase, testDatabaseConnection}  from './config/db.js';
import errorMiddlerware from './middleware/errorMiddlerware.js';
import router from './routes/router.js/'
import morgan from 'morgan';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
testDatabaseConnection();
app.use(errorMiddlerware);
app.use(router);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

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

syncDatabase();
