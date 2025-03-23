import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js'; // Импортируем модель User

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    tableName: 'events',
});

Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Event, { foreignKey: 'userId', as: 'events' });

export default Event;
