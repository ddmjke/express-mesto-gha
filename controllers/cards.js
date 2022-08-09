const Card = require('../models/card');
const BadRequestError = require('../utils/errors/BadRequestError');
const DefaultError = require('../utils/errors/DefaultError');

const NotFoundError = require('../utils/errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => next(new DefaultError('internal server error')));
};

module.exports.postCard = (req, res, next) => {
  const { name, link, likes = [] } = req.body;

  Card.create({
    name, link, likes, owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('bad request'));
      } else {
        next(new DefaultError('internal server error'));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('bad request'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('not found'));
      } else {
        next(new DefaultError('internal server error'));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
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
        next(new BadRequestError('bad request'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Card not found'));
      } else {
        next(new DefaultError('internal server error'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('bad request'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Card not found'));
      } else {
        next(new DefaultError('internal server error'));
      }
    });
};
