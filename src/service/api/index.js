'use strict';

const {Router} = require(`express`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);
const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(() => {
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
})();

module.exports = app;
