import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // окружение из env

//загрузука переменных из env
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
      host: process.env.DB_HOST, 
      port: process.env.DB_PORT, 
      dialect: 'postgres', 
    }
  );


  // Тест подключения к БД todo db
export async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных успешно установлено.');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
}

export async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // { force: true } для разработки
    console.log('База данных успешно синхронизирована.');
  } catch (error) {
    console.error('Ошибка синхронизации базы данных:', error);
  }
}


export default sequelize; 