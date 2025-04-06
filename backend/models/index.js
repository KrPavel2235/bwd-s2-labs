import sequelize from '../config/db.js';
import User from './user.js';
import Event from './event.js';

// Устанавливаем связи между моделями
User.hasMany(Event, { foreignKey: 'userId', as: 'events' });
Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Event };
