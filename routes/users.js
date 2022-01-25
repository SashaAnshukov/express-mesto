// файл маршрутов пользователя
const router = require('express').Router();

const {
  getUsers, createUser, getUserId, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUserId);
router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
