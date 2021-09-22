"use strict";

const Aliase = require(`../models/aliase`);

class CommentRepository {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment,
    });
  }

  async drop(id) {
    const deletedRows = this._Comment.destroy({
      where: {id},
    });
    return !!deletedRows;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true,
    });
  }

  getAll({limit, needArticles}) {
    const query = {
      include: [
        {
          model: this._User,
          as: Aliase.USER,
          attributes: {
            exclude: [`passwordHash`],
          }
        }
      ],
      order: [[`createdAt`, `DESC`]],
      raw: true,
    };

    if (limit) {
      query.limit = limit;
    }

    if (needArticles) {
      query.include.push({
        model: this._Article
      });
    }

    return this._Comment.findAll(query);
  }
}

module.exports = CommentRepository;
