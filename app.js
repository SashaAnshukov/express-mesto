const express = require('express');

const app = express();
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const userRoutes = require('./routes/users'); // импортируем роуты пользователя
const cardRoutes = require('./routes/cards'); // импортируем роуты карточек
const errorHandler = require('./middleware/error-handler');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

/* app.get('/', (request, response) => {
    response.send('wazzzaap');
}); */

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '61e42e8a7b25ff10853f57be', // временное решение
  };
  next();
});

app.use('/', userRoutes); // запускаем импортированные роуты
app.use('/', cardRoutes); // запускаем импортированные роуты

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
