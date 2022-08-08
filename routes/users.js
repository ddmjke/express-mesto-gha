const router = require('express').Router();

const {
  getUsers, getUserById, patchUser, patchAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);

router.patch('/me', patchUser);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
