import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerSetup from './config/swagger.js';

import sequelize from './config/db.js'

import { User, Event } from './models/index.js'; // модели пользователея и мероприятия

// Загружаем переменные окружения
dotenv.config();

// Создаем объект приложения
const app = express();

// Настраиваем middleware
app.use(express.json()); // Для обработки JSON
app.use(cors()); // Для разрешения кросс-доменных запросов

// Тестовый маршрут
app.get('/', (req, res) => {
  res.json({ message: 'Если ты это видешь, то сервак запущен' });
});

//Тест подключения к БД
async function testDatabaseConnection() {
    try {
      await sequelize.authenticate();
      console.log('Подключение к базе данных успешно установлено.');
    } catch (error) {
      console.error('Ошибка подключения к базе данных:', error);
    }
  }
  
  testDatabaseConnection();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление мероприятиями
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список всех мероприятий
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Список мероприятий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Ошибка сервера
 */
app.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении мероприятий' });
  }
});

// Получение одного мероприятия по ID
app.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Мероприятие не найдено' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении мероприятия' });
  }
});

// Создание мероприятия
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое мероприятие
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: Мероприятие успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Некорректные данные
 *       500:
 *         description: Ошибка сервера
 */
app.post('/events', async (req, res) => {
  try {
    const { title, description, date, place, userId } = req.body;

    if (!title || !date || !place || !userId) {
      return res.status(400).json({ error: 'Необходимо указать title, date, place и userId' });
    }

    const event = await Event.create({ title, description, date, place, userId });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании мероприятия' });
  }
});

// Обновление мероприятия
app.put('/events/:id', async (req, res) => {
  try {
    const { title, description, date, place } = req.body;

    // Проверка обязательных полей
    if (!title || !date || !place) {
      return res.status(400).json({ error: 'Необходимо указать title, date и place' });
    }

    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Мероприятие не найдено' });
    }

    event.title = title;
    event.description = description;
    event.date = date;
    event.place = place;
    await event.save();

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении мероприятия' });
  }
});

// Удаление мероприятия
app.delete('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Мероприятие не найдено' });
    }

    await event.destroy();
    res.status(200).json({ message: 'Мероприятие успешно удалено' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении мероприятия' });
  }
});

//GET И POST ДЛЯ ПОЛЬЗОВАТЕЛЕЙ
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Ошибка сервера
 */
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Некорректные данные
 *       500:
 *         description: Ошибка сервера
 */
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Необходимо указать name и email' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании пользователя' });
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

//Задание с моделями пользователя и мероприятия
User.hasMany(Event, { foreignKey: 'userId' });
Event.belongsTo(User, { foreignKey: 'userId' });

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