const Card = require('../models/card');

const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'internal server error' }));
};

module.exports.postCard = (req, res) => {
  const { name, link, likes = [] } = req.body;

  Card.create({
    name, link, likes, owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'internal server error' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request' });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Card not found' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'internal server error' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request' });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Card not found' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'internal server error' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Bad request' });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Card not found' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'internal server error' });
      }
    });
};
