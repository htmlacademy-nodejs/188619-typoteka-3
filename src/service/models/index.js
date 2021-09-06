"use strict";

const {Model} = require(`sequelize`);
const Aliase = require(`./aliase`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `offerId`});
  Comment.belongsTo(Article, {foreignKey: `offerId`});

  ArticleCategory.init({}, {sequelize, tableName: `articleCategories`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Aliase.OFFERS});
  Category.hasMany(ArticleCategory, {as: Aliase.OFFER_CATEGORIES});

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
