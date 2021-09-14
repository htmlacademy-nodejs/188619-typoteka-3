"use strict";

const {Router} = require(`express`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {ensureArray, prepareErrors} = require(`../../utils`);

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`articles/new`, {categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, {comments: true});
  res.render(`articles/index`, {article});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  res.render(`articles/edit`, {article});
});

articlesRouter.post(`/add`, upload.single(`photo`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    picture: file ? file.filename : ``,
    fullText: body[`full-text`],
    announce: body.announce,
    date: body.date,
    title: body.title,
    categories: ensureArray(body.categories),
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    res.render(`articles/new`, {categories, validationMessages});
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`photo`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    picture: file ? file.filename : ``,
    fullText: body[`full-text`],
    announce: body.announce,
    date: body.date,
    title: body.title,
    categories: ensureArray(body.categories),
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [categories, article] = await Promise.all([api.getCategories(), api.getArticle(id)]);
    res.render(`articles/edit`, {categories, article, validationMessages});
  }
});

articlesRouter.get(`/category/:id`, (req, res) =>
  res.render(`articles/category`)
);

module.exports = articlesRouter;
