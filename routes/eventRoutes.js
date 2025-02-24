// Создание мероприятия
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
app.post('/events', async (req, res) => {
    try {
      const { title, description, date, place, userId } = req.body;
  
      if (!title || !date || !place || !userId) {
        return res.status(400).json({ error: 'Необходимо указать title, date, place и userId' });
      }
  
      const event = await Event.create({ title, description, date, place, userId });
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании мероприятия' });
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
app.get('/events', async (req, res) => {
    try {
      const events = await Event.findAll();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении мероприятий' });
    }
  });