'use strict';

const {HttpCode} = require(`../../constants`);

const articleKeys = [`title`, `announce`, `fullText`, `сategory`];

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
