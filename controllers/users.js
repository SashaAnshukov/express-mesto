// файл контроллеров польхователя.
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

// возвращает всех пользователей
module.exports.getUsers = (request, response) => User.find({})
  .then((users) => response.status(200).send({ data: users }))
  .catch(() => response.status(500).send({ message: 'Произошла ошибка' }));

// возвращает пользователя по _id
module.exports.getUserId = (request, response, next) => {
  // console.log(request.params.id)
  const idUser = request.params.id;
  User.findById(idUser)
    .then((userFound) => {
      if (!userFound) {
        throw new NotFoundError(`Запрашиваемый пользователь с id ${idUser} не найден`);
      }
      return response.status(200).json(userFound);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(error.errors).map((err) => err.message).join(', ')}`));
      } else if (error.name === 'CastError') {
        next(new BadRequestError(`Переданный id ${idUser} не корректен`));
      } else {
        next(error); // Для всех остальных ошибок
      }
    });
};

// создание пользователя
module.exports.createUser = (request, response, next) => {
  // console.log('request.body', request.body)
  // получим из объекта запроса имя, описание, аватар пользователя
  const { name, about, avatar } = request.body;

  return User.create({ name, about, avatar }) // создадим пользователя на основе пришедших данных
    .then((user) => response.status(201).send(
      {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    ))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(error.errors).map((err) => err.message).join(', ')}`));
      } else if (error.code === 409) {
        next(new ConflictError('Пользователь с таким именем уже существует'));
      } else {
        next(error); // Для всех остальных ошибок
      }
    });
};

// обновление профиля
module.exports.updateUser = (request, response, next) => User.findByIdAndUpdate(
  // console.log(request.user._id),
  request.user._id,
  { name: request.body.name, about: request.body.about },
  { new: true }, // обработчик then получит на вход обновлённую запись
)
  .then((userUpdate) => {
    if (!userUpdate) {
      throw new NotFoundError(`Запрашиваемый пользователь с id ${request.user._id} не найден`);
    }
    return response.send({ data: userUpdate });
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(`${Object.values(error.errors).map((err) => err.message).join(', ')}`));
    } else {
      next(error); // Для всех остальных ошибок
    }
  });

// обновление аватара
module.exports.updateAvatar = (request, response, next) => User.findByIdAndUpdate(
  request.user._id,
  { avatar: request.body.avatar },
  { new: true }, // обработчик then получит на вход обновлённую запись
)
  .then((avatarUpdate) => {
    if (!avatarUpdate) {
      throw new NotFoundError(`Запрашиваемый пользователь с id ${request.user._id} не найден`);
    }
    return response.send({ data: avatarUpdate });
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(`${Object.values(error.errors).map((err) => err.message).join(', ')}`));
    } else {
      next(error); // Для всех остальных ошибок
    }
  });
