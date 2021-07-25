'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/:id`, (req, res) => res.render(`posts/post`));
articlesRouter.get(`/add`, (req, res) => res.render(`new-post`));
articlesRouter.get(`/edit/:id`, (req, res) => res.render(`new-post`));
articlesRouter.get(`/category/:id`, (req, res) => res.render(`posts/articles-by-category`));

module.exports = articlesRouter;
