import { Router } from 'express';
import userController from '@controllers/user.controller';
import passport from 'passport';
import { isAdmin } from '@middleware/roleMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для управления пользователями
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить всех пользователей (только для админов)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *       403:
 *         description: Недостаточно прав
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  userController.getAllUsers
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Получить пользователя по ID (только для админов)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 */
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  userController.getUserById
);

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
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Иван"
 *               email:
 *                 type: string
 *                 example: "ivan@example.com"
 *               password:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       201:
 *         description: Пользователь создан
 *       400:
 *         description: Ошибка валидации
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  userController.createUser
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Обновить пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Новый Иван"
 *               email:
 *                 type: string
 *                 example: "newemail@example.com"
 *     responses:
 *       200:
 *         description: Пользователь обновлен
 *       404:
 *         description: Пользователь не найден
 */
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  userController.updateUser
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Удалить пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь удален
 *       404:
 *         description: Пользователь не найден
 */
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  userController.deleteUser
);

/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Изменить роль пользователя (только для админов)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Роль пользователя изменена
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 */
router.patch(
  '/:id/role',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  userController.updateUserRole
);

export default router;
