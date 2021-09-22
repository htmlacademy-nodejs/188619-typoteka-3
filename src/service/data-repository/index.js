'use strict';

const CategoryRepository = require(`./category`);
const SearchRepository = require(`./search`);
const CommentRepository = require(`./comment`);
const ArticleRepository = require(`./articles`);
const UserRepository = require(`./user`);

module.exports = {
  CategoryRepository,
  SearchRepository,
  CommentRepository,
  ArticleRepository,
  UserRepository
};
