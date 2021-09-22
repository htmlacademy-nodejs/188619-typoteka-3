'use strict';

const {Router} = require(`express`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const category = require(`./category/category`);
const article = require(`./article/article`);
const search = require(`./search/search`);
const user = require(`./user/user`);
const comment = require(`./comment/comment`);
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
  category(app, new CategoryRepository(sequelize), new ArticleRepository(sequelize));
  search(app, new SearchRepository(sequelize));
  article(app, new ArticleRepository(sequelize), new CommentRepository(sequelize));
  user(app, new UserRepository(sequelize));
  comment(app, new CommentRepository(sequelize));
})();

module.exports = app;
