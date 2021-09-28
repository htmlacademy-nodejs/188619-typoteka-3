"use strict";

const {Router} = require(`express`);
const categoryRouter = new Router();
const api = require(`../api`).getAPI();
const csrf = require(`csurf`);
const csrfProtection = csrf();
const {prepareErrors} = require(`../../utils`);
const adminRoute = require(`../middlewares/amin-route`);


categoryRouter.get(`/`, [adminRoute, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`my/categories`, {user, categories, csrfToken: req.csrfToken()});
});

categoryRouter.post(`/add`, [adminRoute, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();

  const categoryData = {
    name: req.body.name
  };

  try {
    await api.createCategory(categoryData);
    res.redirect(`/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`my/categories`, {user, categories, csrfToken: req.csrfToken(), validationMessages});
  }
});

categoryRouter.post(`/edit/:categoryId`, [adminRoute, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;
  const categories = await api.getCategories();

  const categoryData = {
    name: req.body.name
  };

  try {
    await api.editCategory(categoryId, categoryData);
    res.redirect(`/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`my/categories`, {user, categories, csrfToken: req.csrfToken(), validationMessages});
  }
});

categoryRouter.get(`/delete/:categoryId`, [adminRoute, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;
  const categories = await api.getCategories();
  try {
    await api.deleteCategory(categoryId);
    res.redirect(`/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`my/categories`, {user, categories, csrfToken: req.csrfToken(), validationMessages});
  }
});

module.exports = categoryRouter;
