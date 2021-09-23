'use strict';

const {Router} = require(`express`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const category = require(`./category/category`);
const article = require(`./article/article`);
const search = require(`./search/search`);
const user = require(`./user/user`);
const comment = require(`./comment/comment`);
const CategoryService = require(`./category/category.service`);
const ArticleRepository = require(`./article/articles.repository`);
const CommentRepository = require(`./comment/comment.repository`);
const CommentService = require(`./comment/comment.service`);
const UserService = require(`./user/user.service`);
const SearchService = require(`./search/search.service`);

const app = new Router();

defineModels(sequelize);

(() => {
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleRepository(sequelize), new CommentRepository(sequelize));
  user(app, new UserService(sequelize));
  comment(app, new CommentService(sequelize));
})();

module.exports = app;
