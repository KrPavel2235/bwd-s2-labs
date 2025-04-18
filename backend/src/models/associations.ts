import { User } from '@models/User';
import { Event } from '@models/Event';

export function defineAssociations(): void {
  User.hasMany(Event, {
    foreignKey: 'userId',
    as: 'events',
  });

  Event.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
}
