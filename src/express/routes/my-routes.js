"use strict";

const {Router} = require(`express`);
const adminRoute = require(`../middlewares/admin-route`);
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

myRouter.get(`/comments/delete/:commentId`, adminRoute, async (req, res) => {
  const {commentId} = req.params;
  await api.deleteComment(commentId);
  res.redirect(`/my/comments`);
});

module.exports = myRouter;
