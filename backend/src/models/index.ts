import sequelize from '../config/db.js';
import { User } from './User.js';
import { Event } from './Event.js';

// Устанавливаем связи между моделями
User.hasMany(Event, { foreignKey: 'userId', as: 'events' });
Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Event }; 