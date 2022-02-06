// файл маршрутов пользователя
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');

const {
  getUsers, login, createUser, getUser, getUserId, updateUser, updateAvatar, signout,
} = require('../controllers/users');

// роуты, не требующие авторизации, регистрация и логин
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.get('/signout', signout);

// авторизация
router.use(auth);

// роуты, требующие авторизации
router.get('/users', getUsers);
router.get('/users/:id', getUserId);
router.get('/users/me', getUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);
// router.post('/users', createUser);
// router.get('/secured', secured);
module.exports = router;
