"use strict";

const {Router} = require(`express`);
const schemaValidator = require(`../../middlewares/schema-validator`);
const hasArticleValidator = require(`./validators/has-articles`);
const categorySchema = require(`./validators/category-schema`);
const routeParamsValidator = require(`../../middlewares/route-params-validator`);
const {HttpCode} = require(`../../../constants`);

module.exports = (app, service, articleService) => {
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

  route.post(`/`, [schemaValidator(categorySchema)], async (req, res) => {
    const category = await service.create(req.body);
    return res.status(HttpCode.CREATED).json(category);
  });

  route.put(
      `/:categoryId`,
      [
        schemaValidator(routeParamsValidator, false),
        schemaValidator(categorySchema),
      ],
      async (req, res) => {
        const {categoryId} = req.params;
        const category = await service.update(categoryId, req.body);
        return res.status(HttpCode.OK).json(category);
      }
  );

  route.delete(
      `/:categoryId`,
      [hasArticleValidator(articleService)],
      async (req, res) => {
        const {categoryId} = req.params;
        const category = await service.drop(categoryId);
        return res.status(HttpCode.OK).json(category);
      }
  );
};
