"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const upload = require(`../middlewares/upload`);
const api = require(`../api`).getAPI();
const {prepareErrors} = require(`../../utils`);
const userAuth = require(`../middlewares/user-auth`);
const adminRoute = require(`../middlewares/amin-route`);

const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({limit, offset, needComments: true}),
    api.getCategories({count: true}),
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`main`, {user, articles, categories, page, totalPages});
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  return res.render(`auth/register`, {user});
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  return res.render(`auth/login`, {user});
});

mainRouter.post(`/login`, userAuth);

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  try {
    const {query} = req.query;
    const results = await api.search(query);

    res.render(`search`, {results, user});
  } catch (error) {
    res.render(`search`, {
      results: [],
      user,
    });
  }
});
mainRouter.get(`/categories`, adminRoute, (req, res) =>
  res.render(`categories`)
);

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    avatar: file ? file.filename : ``,
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`auth/register`, {validationMessages});
  }
});

mainRouter.get(`/404`, (req, res) => {
  return res.render(`errors/404`, {errorCode: `404`});
});

mainRouter.get(`/500`, (req, res) => {
  res.render(`errors/500`, {errorCode: `500`});
});

module.exports = mainRouter;
