"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const articleExist = require(`../middlewares/article-exist`);
const commentExist = require(`../middlewares/comment-exist`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, needComments} = req.query;
    let result;
    if (limit || offset) {
      result = await articleService.getPage({limit, offset});
    } else {
      result = await articleService.findAll(needComments);
    }
    res.status(HttpCode.OK).json(result);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {needComments} = req.query;
    const article = await articleService.findOne(articleId, needComments);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.post(
      `/`,
      [routeParamsValidator, articleValidator],
      async (req, res) => {
        const article = await articleService.create(req.body);

        return res.status(HttpCode.CREATED).json(article);
      }
  );

  route.put(
      `/:articleId`,
      [routeParamsValidator, articleExist(articleService), articleValidator],
      async (req, res) => {
        const {articleId} = req.params;
        const offer = await articleService.update(articleId, req.body);

        return res.status(HttpCode.OK).json(offer);
      }
  );

  route.delete(
      `/:articleId`,
      articleExist(articleService),
      async (req, res) => {
        const {articleId} = req.params;
        const offer = await articleService.drop(articleId);

        return res.status(HttpCode.OK).json(offer);
      }
  );

  route.get(
      `/:articleId/comments`,
      articleExist(articleService),
      async (req, res) => {
        const {article} = res.locals;
        return res.status(HttpCode.OK).json(article.comments);
      }
  );

  route.post(
      `/:articleId/comments`,
      [routeParamsValidator, articleExist(articleService), commentValidator],
      async (req, res) => {
        const {articleId} = req.params;
        const comment = await commentService.create(articleId, req.body);
        return res.status(HttpCode.CREATED).json(comment);
      }
  );

  route.delete(
      `/:articleId/comments/:commentId`,
      [articleExist(articleService), commentExist],
      async (req, res) => {
        const {articleId, commentId} = req.params;
        const comment = await commentService.drop(articleId, commentId);

        return res.status(HttpCode.OK).json(comment);
      }
  );
};
