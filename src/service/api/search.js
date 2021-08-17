'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {query} = req.query;

    const categories = await service.findAll(query);
    res.status(HttpCode.OK)
      .json(categories);
  });
};
