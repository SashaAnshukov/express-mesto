//файл контроллеров карточек. Функция, которая выполняет создание, чтение, обновление или удаление документа.
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

// возвращает все карточки
module.exports.getCards = (request, response) => {
  return Card.find({})
    .then(cards => response.status(200).send({ data: cards }))
    .catch(() => response.status(500).send({ message: 'Произошла ошибка' }));
};

// удаляет карточку по _id
module.exports.deleteCard = (request, response, next) => {
  const idCard = request.params.id;
  return Card.findByIdAndRemove(idCard)
  .then(cardFound => {
    if (!cardFound) {
      throw new NotFoundError(`Карточка с id ${idCard} не найдена`);
    }
    return response.status(200).json(cardFound);
  })
  .catch(error => {
    if (error.name === 'CastError') {
      next(new BadRequestError(`Переданный id ${idCard} не корректен`));
    }
    else {
      next(error); // Для всех остальных ошибок
    }
  });
};

// создаёт карточку
module.exports.createCard = (request, response, next) => {
  const { name, link } = request.body; // получим из объекта запроса название и ссылку карточки
  const owner = request.user._id; // временное решение из app.js 20
  return Card.create({ name, link, owner }) // создадим карточку на основе пришедших данных
    .then(card => response.status(201).send(card)) // вернём записанные в базу данные
    .catch(error => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(error.errors).map((error) => error.message).join(', ')}`));
      }
      else {
        next(error); // Для всех остальных ошибок
      }
    });
};

module.exports.likeCard = (request, response, next) => { Card.findByIdAndUpdate(
  request.params.id,
  { $addToSet: { likes: request.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
  )
  .then(card => response.status(201).send(card)) // вернём записанные в базу данные
  .catch(error => {
    if (error.name === 'CastError') {
      next(new BadRequestError(`Переданный id ${request.params.id} не корректен`));
    }
    else {
      next(error); // Для всех остальных ошибок
    }
  });
}

module.exports.dislikeCard = (request, response, next) => { Card.findByIdAndUpdate(
  //console.log(request.user._id),
  request.params.id,
  { $pull: { likes: request.user._id } }, // убрать _id из массива
  { new: true },
  )
  .then(card => response.status(201).send(card)) // вернём записанные в базу данные
  .catch(error => {
    if (error.name === 'CastError') {
      next(new BadRequestError(`Переданный id ${request.params.id} не корректен`));
    }
    else {
      next(error); // Для всех остальных ошибок
    }
  });
}