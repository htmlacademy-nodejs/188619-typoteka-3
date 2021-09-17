'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories({count: true})
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`main`, {articles, categories, page, totalPages});
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
mainRouter.get(`/categories`, (req, res) => res.render(`categories`));
mainRouter.get(`/404`, (req, res) => res.render(`errors/404`, {errorCode: `404`}));
mainRouter.get(`/500`, (req, res) => res.render(`errors/500`, {errorCode: `500`}));

module.exports = mainRouter;
