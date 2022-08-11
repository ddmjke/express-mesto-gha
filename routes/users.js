const router = require('express').Router();

const {
  getUsers, getUserById, patchUser, patchAvatar, getUser,
} = require('../controllers/users');

router.patch('/me/avatar', patchAvatar);

router.get('/me', getUser);
router.patch('/me', patchUser);

router.get('/:userId', getUserById);

router.get('/', getUsers);

module.exports = router;
