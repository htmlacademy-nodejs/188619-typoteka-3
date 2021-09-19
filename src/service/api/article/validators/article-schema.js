'use strict';

const Joi = require(`joi`);

const ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  DATE: `Поле дата обязательно к заполнению`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  ANNOUNCE: `Поле аннонс обязательно к заполнению`,
  ANNOUNCE_MIN: `Анонс содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс не может содержать более 250 символов`,
  PICTURE: `Тип изображения не поддерживается`,
  TEXT_MAX: `Текст публикации не может содержать более 1000 символов`,
  USER_ID: `Некорректный идентификатор пользователя`
};

module.exports = Joi.object({
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
    'string.empty': ErrorArticleMessage.ANNOUNCE,
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX
  }),
  date: Joi.date().required().messages({
    'any.required': ErrorArticleMessage.DATE
  }),
  picture: Joi.string().allow(null, ``).messages({
    'string': ErrorArticleMessage.PICTURE
  }),
  fullText: Joi.string().allow(null, ``).max(1000).messages({
    'string.max': ErrorArticleMessage.TEXT_MAX
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorArticleMessage.USER_ID
  })
});
