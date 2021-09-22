"use strict";

const {Router} = require(`express`);
const schemaValidator = require(`../../middlewares/schema-validator`);
const routeParamsValidator = require(`../../middlewares/route-params-validator`);
const {HttpCode} = require(`../../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK).json(categories);
  });

  route.get(
      `/:categoryId`,
      [schemaValidator(routeParamsValidator, false)],
      async (req, res) => {
        const {categoryId} = req.params;
        const category = await service.findOne(categoryId);
        res.status(HttpCode.OK).json(category);
      }
  );
};
