"use strict";

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
  const comments = await api.getComments({needArticles: true});
  res.render(`my/comments`, {comments, user});
});

module.exports = myRouter;
