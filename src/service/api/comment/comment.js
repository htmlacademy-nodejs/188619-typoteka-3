'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);


module.exports = (app, service) => {
  const route = new Router();

  app.use(`/comments`, route);

  route.get(`/`, async (req, res) => {
    const {limit, needArticles} = req.query;
    const comments = await service.getAll({limit, needArticles});
    res.status(HttpCode.OK)
      .json(comments);
  });
};
