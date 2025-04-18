import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerSetup from './src/config/swagger.js';
import { syncDatabase, testDatabaseConnection } from './src/config/database.js';
import errorMiddleware from './src/middleware/errorMiddleware.js';
import passport from './src/config/passport.js';
import router from './src/routes/router.js';
import authRoutes from './src/routes/authRoutes.js';
import morgan from 'morgan';
import { defineAssociations } from './src/models/associations.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Инициализация моделей и их ассоциаций
defineAssociations();

// Инициализация базы данных
testDatabaseConnection()
    .then(() => syncDatabase(false))
    .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

// Инициализация Passport
app.use(passport.initialize());

// Настройка Swagger
swaggerSetup(app);

// Маршруты
app.use('/', router);
app.use('/auth', authRoutes);

// Обработка ошибок
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
