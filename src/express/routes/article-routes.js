"use strict";

const {Router} = require(`express`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const adminRoute = require(`../middlewares/amin-route`);
const csrf = require(`csurf`);
const csrfProtection = csrf();
const {ensureArray, prepareErrors} = require(`../../utils`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);

articlesRouter.get(`/add`, adminRoute, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`articles/new`, {categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const article = await api.getArticle(id, {needComments: true});
  res.render(`articles/index`, {article, user, csrfToken: req.csrfToken()});
});

articlesRouter.get(
    `/edit/:id`,
    adminRoute,
    csrfProtection,
    async (req, res) => {
      const {id} = req.params;
      const {user} = req.session;
      const [article, categories] = await Promise.all([
        api.getArticle(id),
        api.getCategories(),
      ]);
      res.render(`articles/edit`, {
        article,
        categories,
        user,
        csrfToken: req.csrfToken(),
      });
    }
);

articlesRouter.post(
    `/add`,
    upload.single(`photo`),
    csrfProtection,
    async (req, res) => {
      const {body, file} = req;
      const {user} = req.session;

      const articleData = {
        picture: file ? file.filename : ``,
        fullText: body[`full-text`],
        announce: body.announce,
        date: body.date,
        title: body.title,
        categories: ensureArray(body.categories),
        userId: user.id,
      };

      try {
        await api.createArticle(articleData);
        res.redirect(`/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await api.getCategories();
        res.render(`articles/new`, {
          categories,
          validationMessages,
          csrfToken: req.csrfToken(),
        });
      }
    }
);

articlesRouter.post(
    `/edit/:id`,
    upload.single(`photo`),
    csrfProtection,
    async (req, res) => {
      const {body, file} = req;
      const {id} = req.params;
      const {user} = req.session;

      const articleData = {
        picture: file ? file.filename : ``,
        fullText: body[`full-text`],
        announce: body.announce,
        date: new Date(body.date),
        title: body.title,
        categories: ensureArray(body.categories),
        userId: user.id,
      };

      try {
        await api.editArticle(id, articleData);
        res.redirect(`/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const [categories, article] = await Promise.all([
          api.getCategories(),
          api.getArticle(id),
        ]);
        res.render(`articles/edit`, {
          categories,
          article,
          validationMessages,
          csrfToken: req.csrfToken(),
        });
      }
    }
);

articlesRouter.post(`/:id/comments`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  const {user} = req.session;
  try {
    await api.createComment(id, {userId: user.id, text: comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await api.getArticle(id, {needComments: true});
    res.render(`articles/index`, {
      article,
      validationMessages,
      user,
      csrfToken: req.csrfToken(),
    });
  }
});

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [category, categories, {count, articles}] = await Promise.all([
    api.getCategory(id),
    api.getCategories({count: true}),
    api.getArticles({limit, offset, categoryId: id}),
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`articles/category`, {
    user,
    category,
    categories,
    page,
    totalPages,
    articles,
  });
});

articlesRouter.get(`/delete/:id`, adminRoute, async (req, res) => {
  const {id} = req.params;
  try {
    await api.deleteArticle(id);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/500`);
  }
});

module.exports = articlesRouter;
