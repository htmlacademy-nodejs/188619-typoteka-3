'use strict';

const CategoryService = require(`./category`);
const SearchService = require(`./search`);
const CommentService = require(`./comment`);
const ArticleService = require(`./articles`);
const UserService = require(`./user`);

module.exports = {
  CategoryService,
  SearchService,
  CommentService,
  ArticleService,
  UserService
};
