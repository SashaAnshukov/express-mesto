const User = require('../models/user');

// возвращает всех пользователей
module.exports.getUsers = (request, response) => {
  User.find({})
    .then(users => response.send({ data: users }))
    .catch(() => response.status(500).send({ message: 'Произошла ошибка' }));
};

// возвращает пользователя по _id
module.exports.getUserId = (request, response) => {
  User.findById(request.params.id)
    .then(user => response.send({ data: user }))
    .catch(err => response.status(500).send({ message: 'Произошла ошибка' }));
};

// создание пользователя
module.exports.createUser = (request, response) => {
  const { name, about, avatar } = request.body; // получим из объекта запроса имя, описание, аватар пользователя

  User.create({ name, about, avatar }) // создадим пользователя на основе пришедших данных
    .then(user => response.send(
      {
        name: user.name,
        about: user.about,
        avatar: user.avatar
      }
    )) // вернём записанные в базу данные
    .catch(err => response.status(500).send({ message: 'Произошла ошибка' })); // данные не записались, вернём ошибку
};