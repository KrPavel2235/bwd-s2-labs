const router = new Router();

// Тестовый маршрут
app.get('/', (req, res) => {
    res.json({ message: 'Если ты это видешь, то сервак запущен' });
  });

app.use("/events", eventRouter);


// Маршруты для пользователей todo вынести в роутер
app.get('/users', async (req, res, next) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/users', async (req, res, next) => {
    try {
      const { name, email } = req.body;
  
      if (!name || !email) {
        throw new ValidationError('Необходимо указать name и email');
      }
  
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new ValidationError('Пользователь с таким email уже существует');
      }
  
      const user = await User.create({ name, email });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  });

export default router;