'use strict';

const {Router} = require(`express`);
const {sendRequestedPath} = require(`../../utils`);
const articlesRouter = new Router();

articlesRouter.get(`/:id`, sendRequestedPath);
articlesRouter.get(`/add`, sendRequestedPath);
articlesRouter.get(`/edit/:id`, sendRequestedPath);
articlesRouter.get(`/articles/:id`, sendRequestedPath);

module.exports = articlesRouter;
