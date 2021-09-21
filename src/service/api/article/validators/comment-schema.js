'use strict';

const Joi = require(`joi`);
const {ErrorCommentMessage} = require(`../../../../lang`);

module.exports = Joi.object({
  text: Joi.string().min(10).required().messages({
    'string.min': ErrorCommentMessage.TEXT
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorCommentMessage.USER_ID
  })
});
