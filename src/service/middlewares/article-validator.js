'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  ANNOUNCE_MIN: `Описание содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Заголовок не может содержать более 250 символов`,
  PICTURE: `Изображение не выбрано или тип изображения не поддерживается`,
  TEXT_MAX: `Заголовок не может содержать более 1000 символов`,
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES
      })
  ).min(1).required(),
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX
  }),
  picture: Joi.string().messages({
    'string': ErrorArticleMessage.PICTURE
  }),
  fullText: Joi.string().max(1000).messages({
    'string.max': ErrorArticleMessage.TEXT_MAX
  }),
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
