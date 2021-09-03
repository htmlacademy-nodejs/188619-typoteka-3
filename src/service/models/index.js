"use strict";

const {Model} = require(`sequelize`);
const Aliase = require(`./aliase`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);

  class ArticleCategory extends Model {}
  ArticleCategory.init({}, {sequelize, tableName: Aliase.ARTICLE_CATEGORIES});

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  Article.belongsToMany(Category, {through: `articleCategories`, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: `articleCategories`, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
