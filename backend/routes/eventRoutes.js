const router = new Router();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое мероприятие
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: Мероприятие успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Некорректные данные
 *       500:
 *         description: Ошибка сервера
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, description, date, place, userId } = req.body;

    if (!title || !date || !place || !userId) {
      throw new ValidationError('Необходимо указать title, date, place и userId');
    }

    const event = await Event.create({ title, description, date, place, userId });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});
/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление мероприятиями
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список всех мероприятий
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Список мероприятий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Ошибка сервера
 */
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      throw new NotFoundError('Мероприятие не найдено');
    }
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
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
});

router.delete('/:id', async (req, res, next) => {
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
});

export default router;