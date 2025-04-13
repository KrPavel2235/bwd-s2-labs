import express, { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';

const router: Router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Зарегестрировать пользователя
 *     tags: [Others]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
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
router.post('/register', AuthController.registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: получить jwt token
 *     tags: [Others]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ivan@example.com"
 *               password:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       201:
 *         description: JWT токен получен
 *       401:
 *         description: Неверные пароль или email
 */
router.post('/login', AuthController.loginUser);

export default router; 