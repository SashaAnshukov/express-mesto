//файл контроллеров польхователя. Функция, которая выполняет создание, чтение, обновление или удаление документа.
const res = require('express/lib/response');
const User = require('../models/user');

// возвращает всех пользователей
module.exports.getUsers = (request, response) => {
  return User.find({})
    .then(users => response.status(200).send({ data: users }))
    .catch(() => response.status(500).send({ message: 'Произошла ошибка' }));
};

// возвращает пользователя по _id
module.exports.getUserId = (request, response) => {
  //console.log(request.params.id)
  User.findById(request.params.id)
    .then(userFound => {
      if(!userFound) {
        return response.status(404).end();
      }
      return response.status(200).json(userFound);
    })
    .catch(error => next(error));
};

// создание пользователя
module.exports.createUser = (request, response) => {
  //console.log('request.body', request.body)
  const { name, about, avatar } = request.body; // получим из объекта запроса имя, описание, аватар пользователя

  return User.create({ name, about, avatar }) // создадим пользователя на основе пришедших данных
    .then(user => response.status(201).send(
      {
        name: user.name,
        about: user.about,
        avatar: user.avatar
      }
    )) // вернём записанные в базу данные
    .catch(err => response.status(500).send({ message: 'Произошла ошибка' })); // данные не записались, вернём ошибку

};

// обновление профиля
module.exports.updateUser = (request, response) => {
  return User.findByIdAndUpdate(request.user._id,
    {
      name: request.body.name, about: request.body.about
    },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      upsert: true // если пользователь не найден, он будет создан
    }
  )
  .then(user => response.send({ data: user }))
  .catch(err => response.status(500).send({ message: 'Произошла ошибка' }));
};