const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { SUPER_STRONG_SECRET } = require('../utils/secrets');

const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const BadRequestError = require('../utils/errors/BadRequestError');
const DefaultError = require('../utils/errors/DefaultError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ConflictError = require('../utils/errors/ConflictError');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'Validation failed') {
        next(new BadRequestError());
      } else if (err.code === 11000) {
        next(new ConflictError('Email already in use'));
      } else {
        next(new DefaultError());
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      next(new BadRequestError());
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findOne({ _id: req.params.userId })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('User not found'));
      } else {
        next(new DefaultError());
      }
    });
};

module.exports.getUser = (req, res, next) => {
  const { user } = req.user;
  User.findById(user._id)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((usr) => res.send(usr))
    .catch(() => {
      next(new BadRequestError());
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new NotFoundError());
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('User not found'));
      } else {
        next(new DefaultError());
      }
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      next(new NotFoundError());
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError());
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('User not found'));
      } else if (err.name === 'ValidationError') {
        next(new NotFoundError());
      } else {
        next(new DefaultError());
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
      next(new UnauthorizedError());
    });
};
