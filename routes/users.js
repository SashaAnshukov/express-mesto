// файл маршрутов пользователя
const router = require('express').Router();

const { getUsers, createUser, getUserId, updateUser } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUserId);
router.post('/users', createUser);
router.patch('/users/me', updateUser);

module.exports = router;