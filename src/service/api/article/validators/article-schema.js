'use strict';

const Joi = require(`joi`);
const {ErrorArticleMessage} = require(`../../../../lang`);

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
