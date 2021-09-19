'use strict';

const {Router} = require(`express`);
const adminRoute = require(`../middlewares/amin-route`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, adminRoute, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();
  res.render(`my/index`, {articles, user});
});
myRouter.get(`/comments`, adminRoute, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({needComments: true});
  res.render(`my/comments`, {articles: articles.slice(0, 10), user});
});

module.exports = myRouter;
