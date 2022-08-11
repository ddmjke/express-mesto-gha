const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, patchUser, patchAvatar, getUser,
} = require('../controllers/users');

router.patch('/me/avatar', patchAvatar);

router.get('/me', getUser);
router.patch('/me', patchUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.get('/', getUsers);

module.exports = router;
