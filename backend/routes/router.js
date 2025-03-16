import express from 'express';
import eventRouter from '../eventRoutes.js';
import userRouter from '../userRoutes.js';

const router = express.Router();

// Тестовый маршрут
router.get('/', (req, res) => {
    res.json({ message: 'Если ты это видешь, то сервак запущен' });
});

router.use("/events", eventRouter);
router.use("/users", userRouter);

export default router;