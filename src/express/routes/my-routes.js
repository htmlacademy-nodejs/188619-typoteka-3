'use strict';

const {Router} = require(`express`);
const {sendRequestedPath} = require(`../../utils`);
const myRouter = new Router();

myRouter.get(`/`, sendRequestedPath);
myRouter.get(`/comments`, sendRequestedPath);

module.exports = myRouter;
