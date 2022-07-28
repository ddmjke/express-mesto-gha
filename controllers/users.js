const User = require('../models/user');

const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../utils/errors');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request' });
      res.status(DEFAULT_ERROR).send({ message: 'internal server error' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'internal server error' }));
};

module.exports.getUserById = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') res.status(NOT_FOUND_ERROR).send({ message: 'User not found' });
      res.status(DEFAULT_ERROR).send(err.message);
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') res.status(NOT_FOUND_ERROR).send({ message: 'User not found' });
      if (err.name === 'ValidationError') res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request' });
      res.status(DEFAULT_ERROR).send({ message: 'Internal server error' });
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') res.status(NOT_FOUND_ERROR).send({ message: 'User not found' });
      if (err.name === 'ValidationError') res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request' });
      res.status(DEFAULT_ERROR).send({ message: 'Internal server error' });
    });
};
