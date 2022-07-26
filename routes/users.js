const router = require('express').Router();

const { getUser, getUserById, createUser } = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUserById);
router.put('/', createUser);

module.exports = router;
