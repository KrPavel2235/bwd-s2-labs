import User from './User.js';
import Event from './Event.js';

// Связь "один ко многим"
User.hasMany(Event, { foreignKey: 'userId' }); // У пользователя может быть много мероприятий
Event.belongsTo(User); // Мероприятие принадлежит одному пользователю

export { User, Event };