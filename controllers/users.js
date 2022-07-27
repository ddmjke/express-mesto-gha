const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.getUserById = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(err.message));
};
