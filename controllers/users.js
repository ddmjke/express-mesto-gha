const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { SUPER_STRONG_SECRET } = require('../utils/secrets');

const {
  UnauthorizedError, BadRequestError, DefaultError, NotFoundError,
} = require('../utils/errors/UnauthorizedError');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('bad request'));
      } else {
        next(new DefaultError('internal server error'));
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      next(new BadRequestError('bad request'));
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findOne({ _id: req.params.userId })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('bad request'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('User not found'));
      } else {
        next(new DefaultError('internal server error'));
      }
    });
};

module.exports.getUser = (req, res, next) => {
  const { user } = req.user;
  User.findById(user._id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((usr) => res.send(usr))
    .catch(() => {
      next(new BadRequestError('bad request'));
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new NotFoundError('not found'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('User not found'));
      } else {
        next(new DefaultError('internal server error'));
      }
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      next(new NotFoundError('not found'));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('not found'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('User not found'));
      } else if (err.name === 'ValidationError') {
        next(new NotFoundError('not found'));
      } else {
        next(new DefaultError('internal server error'));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SUPER_STRONG_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('unauthorized'));
    });
};
