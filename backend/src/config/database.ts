import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'event_management',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

export async function testDatabaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}
export async function syncDatabase(force = false): Promise<void> {
  try {
    await sequelize.sync({ force });
  } catch (error) {
    console.error('Database sync failed:', error);
    throw error;
  }
}
