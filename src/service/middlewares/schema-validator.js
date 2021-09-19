"use strict";

const {HttpCode} = require(`../../constants`);

module.exports =
  (schema, needValidateBody = true) =>
    (req, res, next) => {
      const value = needValidateBody ? req.body : req.params;

      const {error} = schema.validate(value, {abortEarly: false});

      if (error) {
        return res.status(HttpCode.BAD_REQUEST).send(error.details.map((err) => err.message).join(`\n`));
      }

      return next();
    };
