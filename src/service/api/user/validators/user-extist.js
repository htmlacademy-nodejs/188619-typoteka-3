'use strict';

const {HttpCode} = require(`../../../../constants`);

module.exports = (service) => async (req, res, next) => {
  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(`Email already in use`);
  }

  return next();
};
