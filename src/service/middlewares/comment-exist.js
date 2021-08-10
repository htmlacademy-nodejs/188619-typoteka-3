'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = () => (req, res, next) => {
  const offer = res.locals.offer;
  const {commentId} = req.params;

  const comment = offer.comments.find((item) => item.id === commentId);

  if (!comment) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Comment with id ${commentId} not found in offer with id ${offer.id}`);
  }

  return next();
};
