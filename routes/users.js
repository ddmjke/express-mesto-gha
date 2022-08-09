const router = require('express').Router();

const {
  getUsers, getUserById, patchUser, patchAvatar, getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);

router.get('/me', getUser);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
