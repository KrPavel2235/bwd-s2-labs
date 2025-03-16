import { ValidationError, NotFoundError } from "../config/error.js";
import Event from "../models/Event.js";

export async function createEvent(req, res, next) {
    try {
        const { title, description, date, place, userId } = req.body;;
    
        if (!title || !date || !place || !userId ) {
          throw new ValidationError('необходимо указать title date place userId')
        }

        const event = await Event.create({title, description, date, place, userId});
    
        res.status(200).json(event);
      } catch (error) {
        next(error);
      }
}

export async function getAllEvent(req, res, next) {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
      } catch (error) {
        next(error);
      }
}

export async function getByIdEvent(req,res,next){
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
          throw new NotFoundError('Мероприятие не найдено');
        }
        res.status(200).json(event);
      } catch (error) {
        next(error);
      }
}

export async function putByIdEvent(res, req, next) {
    try {
        const { title, description, date, place } = req.body;
    
        if (!title || !date || !place) {
          throw new ValidationError('Необходимо указать title, date и place');
        }
    
        const event = await Event.findByPk(req.params.id);
        if (!event) {
          throw new NotFoundError('Мероприятие не найдено');
        }
    
        event.title = title;
        event.description = description;
        event.date = date;
        event.place = place;
        await event.save();
    
        res.status(200).json(event);
      } catch (error) {
        next(error);
      }

}

export async function deleteByIdEvent(res, req, next) {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
          throw new NotFoundError('Мероприятие не найдено');
        }
    
        await event.destroy();
        res.status(200).json({ message: 'Мероприятие успешно удалено' });
      } catch (error) {
        next(error);
      }
}