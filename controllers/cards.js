//файл контроллеров карточек. Функция, которая выполняет создание, чтение, обновление или удаление документа.
const Card = require('../models/card');

// возвращает все карточки
module.exports.getCards = (request, response) => {
  return Card.find({})
    .then(cards => response.status(200).send({ data: cards }))
    .catch(() => response.status(500).send({ message: 'Произошла ошибка' }));
};

// удаляет карточку по _id
module.exports.deleteCard = (request, response) => {
  return Card.findByIdAndRemove(request.params.id)
    .then(card => response.status(200).send({ data: card }))
    .catch(err => response.status(500).send({ message: 'Произошла ошибка' }));
};

// создаёт карточку

module.exports.createCard = (request, response) => {
  const { name, link } = request.body; // получим из объекта запроса название и ссылку карточки
  const owner = request.user._id; // временное решение из app.js 20
  //console.log('request.body', request.body);
  //console.log('request.user._id', request.user._id);
  return Card.create({ name, link, owner }) // создадим карточку на основе пришедших данных
    .then(card => response.status(201).send(card)) // вернём записанные в базу данные
    .catch(err => response.status(500).send({ message: 'Произошла ошибка' })); // данные не записались, вернём ошибку

};