import { Request, Response, NextFunction } from 'express';
import { Event, EventAttributes } from '@models/Event';
import { User } from '@models/User';
import { NotFoundError, ForbiddenError } from '@config/error';

type CreateEventRequest = Omit<EventAttributes, 'id'> & {
  date: string;
};

type UpdateEventRequest = Partial<CreateEventRequest>;

const eventController = {
  // Получить все события
  async getAllEvents(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const events = await Event.findAll();
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
      const event = await Event.findByPk(id);

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
      const { title, description, date, place, location } = req.body;
      const user = req.user as User;

      if (!user) {
        throw new ForbiddenError('Пользователь не авторизован');
      }

      const event = await Event.create({
        title,
        description,
        date: new Date(date),
        place,
        location,
        userIDs: [user.id],
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

      if (!event.userIDs.includes(user.id)) {
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

      if (!event.userIDs.includes(user.id)) {
        throw new ForbiddenError('Нет прав на удаление этого события');
      }

      await event.destroy();

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // Записаться на мероприятие
  async registerForEvent(
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

      // Проверяем, не записан ли уже пользователь
      if (event.userIDs.includes(user.id)) {
        throw new ForbiddenError('Вы уже записаны на это мероприятие');
      }

      // Добавляем ID пользователя в массив userIds
      const updatedUserIDs = [...event.userIDs, user.id];
      await event.update({ userIDs: updatedUserIDs });

      res.json({ message: 'Вы успешно записаны на мероприятие' });
    } catch (error) {
      next(error);
    }
  },

  // Отменить запись на мероприятие
  async cancelRegistration(
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

      // Проверяем, записан ли пользователь
      if (!event.userIDs.includes(user.id)) {
        throw new ForbiddenError('Вы не записаны на это мероприятие');
      }

      // Удаляем ID пользователя из массива userIds
      const updatedUserIDs = event.userIDs.filter(userId => userId !== user.id);
      await event.update({ userIDs: updatedUserIDs });

      res.json({ message: 'Вы отменили запись на мероприятие' });
    } catch (error) {
      next(error);
    }
  },
};

export default eventController;
