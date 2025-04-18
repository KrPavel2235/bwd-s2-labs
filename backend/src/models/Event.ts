import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@config/database';

export interface EventAttributes {
  id: number;
  title: string;
  description?: string;
  date: Date;
  place: string;
  userId: number;
}

export interface EventCreationAttributes extends Optional<EventAttributes, 'id'> {}

export class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  declare id: number;
  declare title: string;
  declare description: string;
  declare date: Date;
  declare place: string;
  declare userId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    place: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'events',
  }
);
