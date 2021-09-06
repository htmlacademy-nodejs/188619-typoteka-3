'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories()
  ]);
  res.render(`main`, {articles, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`auth/register`));
mainRouter.get(`/login`, (req, res) => res.render(`auth/login`));
mainRouter.get(`/search`, async (req, res) => {
  try {
    const {query} = req.query;
    const results = await api.search(query);

    res.render(`search`, {results});
  } catch (error) {
    res.render(`search`, {
      results: []
    });
  }
});
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));
mainRouter.get(`/404`, (req, res) => res.render(`errors/404`, {errorCode: `404`}));
mainRouter.get(`/500`, (req, res) => res.render(`errors/500`, {errorCode: `500`}));

module.exports = mainRouter;
