'use strict';

const Joi = require(`joi`);
const {ErrorRegisterMessage} = require(`../../../../lang`);

module.exports = Joi.object({
  name: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': ErrorRegisterMessage.NAME
  }),
  surname: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': ErrorRegisterMessage.SURNAME
  }),
  email: Joi.string().email().required().messages({
    'string.email': ErrorRegisterMessage.EMAIL
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': ErrorRegisterMessage.PASSWORD
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).required().messages({
    'any.only': ErrorRegisterMessage.PASSWORD_REPEATED
  }),
  avatar: Joi.string().allow(null, ``)
});
