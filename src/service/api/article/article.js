"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);
const schemaValidator = require(`../../middlewares/schema-validator`);
const articleSchema = require(`./validators/article-schema`);
const routeParamsValidator = require(`../../middlewares/route-params-validator`);
const commentSchema = require(`./validators/comment-schema`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    let result = await service.getArticles(req.query);
    res.status(HttpCode.OK).json(result);
  });

  route.get(`/most-commented`, async (req, res) => {
    const {limit} = req.query;
    let result = await service.getMostCommented(limit);
    res.status(HttpCode.OK).json(result);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {needComments} = req.query;
    const article = await service.findOne(articleId, needComments);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.post(
      `/`,
      [
        schemaValidator(routeParamsValidator, false),
        schemaValidator(articleSchema),
      ],
      async (req, res) => {
        const article = await service.create(req.body);
        return res.status(HttpCode.CREATED).json(article);
      }
  );

  route.put(
      `/:articleId`,
      [
        schemaValidator(routeParamsValidator, false),
        schemaValidator(articleSchema),
      ],
      async (req, res) => {
        const {articleId} = req.params;
        let result = null;
        try {
          result = await service.update(articleId, req.body);
        } catch (error) {
          return res.status(HttpCode.NOT_FOUND).send(error.message);
        }

        return res.status(HttpCode.OK).json(result);
      }
  );

  route.delete(`/:articleId`, async (req, res) => {
    let result = null;
    const {articleId} = req.params;
    try {
      result = await service.delete(articleId);
    } catch (error) {
      return res.status(HttpCode.NOT_FOUND).send(error.message);
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.post(
      `/:articleId/comments`,
      [
        schemaValidator(routeParamsValidator, false),
        schemaValidator(commentSchema),
      ],
      async (req, res) => {
        let result = null;
        const {articleId} = req.params;
        try {
          result = await service.createComment(articleId, req.body);
        } catch (error) {
          return res.status(HttpCode.NOT_FOUND).send(error.message);
        }
        return res.status(HttpCode.CREATED).json(result);
      }
  );

  route.delete(`/:articleId/comments/:commentId`, async (req, res) => {
    let result = null;
    const {articleId, commentId} = req.params;
    try {
      result = await service.deleteComment(articleId, commentId);
    } catch (error) {
      return res.status(HttpCode.NOT_FOUND).send(error.message);
    }

    return res.status(HttpCode.OK).json(result);
  });
};
