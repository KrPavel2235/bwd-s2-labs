/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями
 */

import { create, getAll } from "../controllers/user.controller";

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
app.get('/users', getAll);
  
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
  app.post('/users', create);