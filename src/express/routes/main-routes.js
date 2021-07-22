'use strict';

const {Router} = require(`express`);
const {sendRequestedPath} = require(`../../utils`);
const mainRouter = new Router();

mainRouter.get(`/`, sendRequestedPath);
mainRouter.get(`/register`, sendRequestedPath);
mainRouter.get(`/login`, sendRequestedPath);
mainRouter.get(`/search`, sendRequestedPath);
mainRouter.get(`/categories`, sendRequestedPath);

module.exports = mainRouter;
