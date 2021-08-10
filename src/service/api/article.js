'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exist`);
const commentExist = require(`../middlewares/comment-exist`);
const commentValidator = require(`../middlewares/comment-validator`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const offers = service.findAll();

    return res.status(HttpCode.OK)
      .json(offers);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = service.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = service.create(req.body);

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.put(`/:articleId`, articleExist(service), (req, res) => {
    const {articleId} = req.params;
    const offer = service.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.delete(`/:articleId`, articleExist(service), (req, res) => {
    const {articleId} = req.params;
    const offer = service.drop(articleId);

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.get(`/:articleId/comments`, articleExist(service), (req, res) => {
    const {article} = res.locals;
    return res.status(HttpCode.OK)
      .json(article.comments);
  });

  route.post(`/:articleId/comments`, [articleExist(service), commentValidator], (req, res) => {
    const {articleId} = req.params;
    const comment = service.createComment(articleId, req.body);
    return res.status(HttpCode.OK)
      .json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, [articleExist(service), commentExist()], (req, res) => {
    const {articleId, commentId} = req.params;
    const comment = service.dropComment(articleId, commentId);

    return res.status(HttpCode.OK)
      .json(comment);
  });
};
