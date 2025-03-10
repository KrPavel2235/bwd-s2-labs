import { createUser } from "../services/user.service";

export async function create(req, res) {
    try {
        const { name, email } = req.body;
    
        if (!name || !email) {
          return res.status(400).json({ error: 'Необходимо указать name и email' });
        }

        const user = await createUser(name, email);
    
        res.status(201).json(user);
      } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании пользователя' });
      }
}

export function getAll(req, res) {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении пользователей' });
      }
}