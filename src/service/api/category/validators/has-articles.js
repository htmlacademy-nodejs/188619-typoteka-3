"use strict";

const {HttpCode} = require(`../../../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {categoryId} = req.params;
  const {count} = await service.getPage({limit: 1, offset: 1, categoryId});

  if (count) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(`Невозможно удалить категорию, т.к. она содержит публикации`);
  }

  return next();
};
