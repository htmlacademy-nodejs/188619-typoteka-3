"use strict";

const {Model} = require(`sequelize`);
const Aliase = require(`./aliase`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: {name: `articleId`, allowNull: false}});
  Comment.belongsTo(Article, {foreignKey: {name: `articleId`, allowNull: false}, onDelete: `CASCADE`});

  ArticleCategory.init({}, {sequelize, tableName: `articleCategories`});
  Article.belongsToMany(Category, {through: ArticleCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});

  User.hasMany(Article, {as: Aliase.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {as: Aliase.USER, foreignKey: `userId`});

  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Aliase.USER, foreignKey: `userId`});

  return {Category, Comment, Article, ArticleCategory, User};
};

module.exports = define;
