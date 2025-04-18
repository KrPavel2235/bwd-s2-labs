import express, { Router, Request, Response } from 'express';
import eventRouter from '@routes/eventRoutes';
import userRouter from '@routes/userRoutes';

const router: Router = express.Router();

// Тестовый маршрут
router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Если ты это видешь, то сервак запущен' });
});

router.use('/events', eventRouter);
router.use('/users', userRouter);

export default router;
