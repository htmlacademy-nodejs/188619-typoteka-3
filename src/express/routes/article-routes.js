"use strict";

const {Router} = require(`express`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post`, {categories});
});

articlesRouter.get(`/:id`, (req, res) => res.render(`posts/post`));

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  res.render(`edit-post`, {article});
});

articlesRouter.post(`/add`, upload.single(`photo`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    photo: file ? file.filename : ``,
    fullText: body[`full-text`],
    announce: body.announce,
    title: body.title,
    category: body.category,
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    console.log(e);
    res.redirect(`back`);
  }
});

articlesRouter.get(`/category/:id`, (req, res) =>
  res.render(`posts/articles-by-category`)
);

module.exports = articlesRouter;
