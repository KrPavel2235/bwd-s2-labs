import { User } from './User.js';
import { Event } from './Event.js';

export function defineAssociations(): void {
  User.hasMany(Event);
  Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });
} 