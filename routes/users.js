const router = require('express').Router();

const {
  getUsers, getUserById, patchUser, patchAvatar, getUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', getUsers);
router.get('/:userId', getUserById);

router.get('/me', auth, getUser);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
