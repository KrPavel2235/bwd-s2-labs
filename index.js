// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerSetup from './config/swagger.js';
import sequelize from './config/db.js';
import { User, Event } from './models/index.js';
import { ValidationError, NotFoundError } from './config/error.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Тестовый маршрут
app.get('/', (req, res) => {
  res.json({ message: 'Если ты это видешь, то сервак запущен' });
});

// Тест подключения к БД
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных успешно установлено.');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
}

testDatabaseConnection();

// Обработка ошибок
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  res.status(500).json({ error: 'Что-то пошло не так' });
});

// Маршруты для мероприятий
app.get('/events', async (req, res, next) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
});

app.get('/events/:id', async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      throw new NotFoundError('Мероприятие не найдено');
    }
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
});

app.post('/events', async (req, res, next) => {
  try {
    const { title, description, date, place, userId } = req.body;

    if (!title || !date || !place || !userId) {
      throw new ValidationError('Необходимо указать title, date, place и userId');
    }

    const event = await Event.create({ title, description, date, place, userId });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

app.put('/events/:id', async (req, res, next) => {
  try {
    const { title, description, date, place } = req.body;

    if (!title || !date || !place) {
      throw new ValidationError('Необходимо указать title, date и place');
    }

    const event = await Event.findByPk(req.params.id);
    if (!event) {
      throw new NotFoundError('Мероприятие не найдено');
    }

    event.title = title;
    event.description = description;
    event.date = date;
    event.place = place;
    await event.save();

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
});

app.delete('/events/:id', async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      throw new NotFoundError('Мероприятие не найдено');
    }

    await event.destroy();
    res.status(200).json({ message: 'Мероприятие успешно удалено' });
  } catch (error) {
    next(error);
  }
});

// Маршруты для пользователей
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

app.post('/users', async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new ValidationError('Необходимо указать name и email');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ValidationError('Пользователь с таким email уже существует');
    }

    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

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

// Синхронизация моделей с базой данных
async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // { force: true } для разработки
    console.log('База данных успешно синхронизирована.');
  } catch (error) {
    console.error('Ошибка синхронизации базы данных:', error);
  }
}

syncDatabase();