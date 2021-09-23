"use strict";

const {Router} = require(`express`);
const schemaValidator = require(`../../middlewares/schema-validator`);
const categorySchema = require(`./validators/category-schema`);
const routeParamsValidator = require(`../../middlewares/route-params-validator`);
const {HttpCode} = require(`../../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {needCount = false} = req.query;
    const categories = await service.findAll(needCount);
    res.status(HttpCode.OK).json(categories);
  });

  route.get(
      `/:categoryId`,
      [schemaValidator(routeParamsValidator, false)],
      async (req, res) => {
        const {categoryId} = req.params;
        const category = await service.findOne(categoryId);
        if (!category) {
          return res.status(HttpCode.NOT_FOUND).json(`Not found`);
        }
        return res.status(HttpCode.OK).json(category);
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

  route.delete(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    let category = null;
    try {
      category = await service.delete(categoryId);
    } catch (error) {
      return res.status(HttpCode.BAD_REQUEST).send(error.message);
    }
    if (!category) {
      return res.status(HttpCode.NOT_FOUND).json(`Not found`);
    }
    return res.status(HttpCode.OK).json(category);
  });
};
