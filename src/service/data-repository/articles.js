"use strict";

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class ArticleRepository {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id},
    });
    return !!deletedRows;
  }

  findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USER,
            attributes: {
              exclude: [`passwordHash`],
            },
          },
        ],
      });
    }
    return this._Article.findByPk(id, {include});
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id},
    });

    const updatedArticle = await this._Article.findOne({
      where: {id},
    });

    await updatedArticle.setCategories(article.categories);

    return !!affectedRows;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USER,
            attributes: {
              exclude: [`passwordHash`],
            },
          },
        ],
      });
    }
    const articles = await this._Article.findAll({include});
    return articles.map((item) => item.get());
  }

  async getPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, Aliase.COMMENTS],
      distinct: true,
      order: [[`date`, `DESC`]],
    });
    return {count, articles: rows};
  }

  async getCommented() {
    return await this._Article.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)),
            `commentsCount`,
          ],
        ],
      },
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [],
        },
      ],
      group: [`Article.id`],
    });
  }
}

module.exports = ArticleRepository;
