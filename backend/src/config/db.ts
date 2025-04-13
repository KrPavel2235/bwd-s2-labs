import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'event_management',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

export async function testDatabaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных успешно установлено.');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
    throw error;
  }
}

export async function syncDatabase(force = false): Promise<void> {
  try {
    await sequelize.sync({ force });
    console.log(`База данных успешно синхронизирована. Force mode: ${force}`);
  } catch (error) {
    console.error('Ошибка синхронизации базы данных:', error);
    throw error;
  }
}

export default sequelize; 