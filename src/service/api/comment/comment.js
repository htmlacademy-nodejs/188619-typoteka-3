"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);
const schemaValidator = require(`../../middlewares/schema-validator`);
const routeParamsValidator = require(`../../middlewares/route-params-validator`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/comments`, route);

  route.get(`/`, async (req, res) => {
    const {limit, needArticles} = req.query;
    const comments = await service.getAll({limit, needArticles});
    res.status(HttpCode.OK).json(comments);
  });

  route.delete(
      `/:commentId`,
      [schemaValidator(routeParamsValidator)],
      async (req, res) => {
        const {commentId} = req.params;
        const comment = await service.delete(commentId);
        return res.status(HttpCode.OK).json(comment);
      }
  );
};
