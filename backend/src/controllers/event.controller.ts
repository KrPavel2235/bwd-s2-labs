import { Request, Response, NextFunction } from 'express';
import { Event, EventAttributes } from '@models/Event';
import { User } from '@models/User';
import { NotFoundError, ForbiddenError } from '@config/error';

type CreateEventRequest = Omit<EventAttributes, 'id' | 'userId'> & {
  date: string;
};

type UpdateEventRequest = Partial<CreateEventRequest>;



const eventController = {
  // Получить все события
  async getAllEvents(_req: Request, res: Response, next: NextFunction): Promise<void> {
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
  async getEventById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id, {
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      });

      if (!event) {
        throw new NotFoundError('Событие не найдено');
      }

      res.json(event);
    } catch (err) {
      next(err);
    }
  },

  // Создать новое событие
  async createEvent(
    req: Request<Record<string, never>, Record<string, never>, CreateEventRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, description, date, place } = req.body;
      const user = req.user as User;

      if (!user) {
        throw new ForbiddenError('Пользователь не авторизован');
      }

      const event = await Event.create({
        title,
        description,
        date: new Date(date),
        place,
        userId: user.id,
      });

      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  },

  // Обновить событие
  async updateEvent(
    req: Request<{ id: string }, Record<string, never>, UpdateEventRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { date, ...restUpdates } = req.body;
      const user = req.user as User;

      if (!user) {
        throw new ForbiddenError('Пользователь не авторизован');
      }

      const event = await Event.findByPk(id);

      if (!event) {
        throw new NotFoundError('Событие не найдено');
      }

      if (event.userId !== user.id) {
        throw new ForbiddenError('Нет прав на редактирование этого события');
      }

      await event.update({
        ...restUpdates,
        ...(date ? { date: new Date(date) } : {}),
      });

      res.json(event);
    } catch (error) {
      next(error);
    }
  },

  // Удалить событие
  async deleteEvent(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as User;

      if (!user) {
        throw new ForbiddenError('Пользователь не авторизован');
      }

      const event = await Event.findByPk(id);

      if (!event) {
        throw new NotFoundError('Событие не найдено');
      }

      if (event.userId !== user.id) {
        throw new ForbiddenError('Нет прав на удаление этого события');
      }

      await event.destroy();

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

export default eventController;
