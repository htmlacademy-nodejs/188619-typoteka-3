'use strict';

const Joi = require(`joi`);
const {ErrorCategoryMessage} = require(`../../../../lang`);

module.exports = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    'string.empty': ErrorCategoryMessage.EMPTY,
    'string.min': ErrorCategoryMessage.MIN,
    'string.max': ErrorCategoryMessage.MAX,
  })
});
