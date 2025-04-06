import Event from '../models/Event.js';
import User from '../models/User.js';
import { BadRequestError, NotFoundError } from '../config/error.js';

const eventController = {
    // Получить все события
    async getAllEvents(req, res, next) {
      try {
          const events = await Event.findAll({
              include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
          });
          res.json(events);
      } catch (err) {
          next(err);
      }
  },

    // Получить событие по ID
    async getEventById(req, res, next) {
        try {
            const { id } = req.params;
            const event = await Event.findByPk(id, {include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]});

            if (!event) {
                throw new NotFoundError('Событие не найдено');
            }

            res.json(event);
        } catch (err) {
            next(err);
        }
    },

    // Создать новое событие
    async createEvent(req, res, next) {
        try {
            const { title, description, date, place, userId } = req.body;

            if (!title || !date || !place || !userId) {
                throw new BadRequestError('Название, дата, место и userId обязательны');
            }

            const user = await User.findByPk(userId);
            if (!user) {
                throw new NotFoundError('Пользователь не найден');
            }

            const newEvent = await Event.create({ title, description, date, place, userId });
            res.status(201).json(newEvent);
        } catch (err) {
            next(err);
        }
    },

    // Обновить событие
    async updateEvent(req, res, next) {
        try {
            const { id } = req.params;
            const { title, description, date, place } = req.body;

            const event = await Event.findByPk(id);
            if (!event) {
                throw new NotFoundError('Событие не найдено');
            }

            await event.update({ title, description, date, place });
            res.json(event);
        } catch (err) {
            next(err);
        }
    },

    // Удалить событие
    async deleteEvent(req, res, next) {
        try {
            const { id } = req.params;
            const event = await Event.findByPk(id);

            if (!event) {
                throw new NotFoundError('Событие не найдено');
            }

            await event.destroy();
            res.json({ message: 'Событие удалено' });
        } catch (err) {
            next(err);
        }
    }
};

export default eventController;
