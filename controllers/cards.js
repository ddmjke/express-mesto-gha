const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.postCard = (req, res) => {
  const { name, link, likes = [] } = req.body;

  Card.create({name, link, likes, owner: req.user._id })
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { _id } = req.body;
  Card.findOne({ _id }).remove()
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then(() => res.send())
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then(() => res.send())
    .catch(err => res.status(500).send({ message: err.message }));
  }
