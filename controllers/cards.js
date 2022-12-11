const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { ok200 } = require('../utils/errorsCodes');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка 400: Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Ошибка 404: Карточка не найдена'));
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Ошибка 403: Карточка создана другим пользователем'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка 400: Некорректный id карточки'));
        return;
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Ошибка 404: Карточка не найдена');
      }
      return res.send(card);
    }).catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка 400: Некорректный id карточки'));
        return;
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new NotFoundError('Ошибка 404: Карточка не найдена');
    }
    return res.status(ok200).send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка 400: Некорректный id карточки'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
};
