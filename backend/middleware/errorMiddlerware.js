export default function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      res.status(500).json({ error: 'Что-то пошло не так' });
}