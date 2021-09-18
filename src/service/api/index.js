'use strict';

const {Router} = require(`express`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);
const user = require(`../api/user`);
const {
  CategoryRepository,
  SearchRepository,
  ArticleRepository,
  CommentRepository,
  UserRepository
} = require(`../data-repository`);

const app = new Router();

defineModels(sequelize);

(() => {
  category(app, new CategoryRepository(sequelize));
  search(app, new SearchRepository(sequelize));
  article(app, new ArticleRepository(sequelize), new CommentRepository(sequelize));
  user(app, new UserRepository(sequelize));
})();

module.exports = app;
