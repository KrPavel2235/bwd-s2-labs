import { Router } from 'express';
import eventController from '@controllers/event.controller';
import passport from 'passport';
import { isUser } from '@middleware/roleMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API для управления событиями
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить все события
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Список событий
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получить событие по ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID события
 *     responses:
 *       200:
 *         description: Данные события
 *       404:
 *         description: Событие не найдено
 */
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  isUser,
  eventController.getEventById
);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое событие
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, date, place, userId]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Конференция"
 *               description:
 *                 type: string
 *                 example: "Описание конференции"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-10T12:00:00Z"
 *               place:
 *                 type: string
 *                 example: "Москва"
 *               location:
 *                 type: string
 *                 example: "55.7558, 37.6173"
 *               userId:
 *                 type: string
 *                 example: "uuid-пользователя"
 *     responses:
 *       201:
 *         description: Событие создано
 *       400:
 *         description: Ошибка валидации
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  isUser,
  eventController.createEvent
);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновить событие
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID события
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Обновленное название"
 *               description:
 *                 type: string
 *                 example: "Новое описание"
 *     responses:
 *       200:
 *         description: Событие обновлено
 *       404:
 *         description: Событие не найдено
 */
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  isUser,
  eventController.updateEvent
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удалить событие
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID события
 *     responses:
 *       200:
 *         description: Событие удалено
 *       404:
 *         description: Событие не найдено
 */
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  isUser,
  eventController.deleteEvent
);

/**
 * @swagger
 * /events/{id}/register:
 *   post:
 *     summary: Записаться на мероприятие
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID события
 *     responses:
 *       200:
 *         description: Успешная запись на мероприятие
 *       404:
 *         description: Событие не найдено
 *       403:
 *         description: Пользователь уже записан на мероприятие
 */
router.post(
  '/:id/register',
  passport.authenticate('jwt', { session: false }),
  isUser,
  eventController.registerForEvent
);

/**
 * @swagger
 * /events/{id}/cancel:
 *   post:
 *     summary: Отменить запись на мероприятие
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID события
 *     responses:
 *       200:
 *         description: Запись на мероприятие отменена
 *       404:
 *         description: Событие не найдено
 *       403:
 *         description: Пользователь не записан на мероприятие
 */
router.post(
  '/:id/cancel',
  passport.authenticate('jwt', { session: false }),
  isUser,
  eventController.cancelRegistration
);

export default router;
