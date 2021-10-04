"use strict";

const ArticleRepository = require(`./article.repository`);
const CommentRepository = require(`../comment/comment.repository`);

class ArticleService {
  constructor(sequelize) {
    this.repository = new ArticleRepository(sequelize);
    this.commentRepository = new CommentRepository(sequelize);
  }

  getArticles({offset, limit, needComments, categoryId}) {
    if (offset && limit) {
      return this.repository.getPage({offset, limit, categoryId});
    }

    return this.repository.findAll(needComments);
  }

  getMostCommented(limit) {
    return this.repository.getCommented(limit);
  }

  findOne(id, needComments) {
    return this.repository.findOne(id, needComments);
  }

  create(data) {
    return this.repository.create(data);
  }

  async isArticleExist(id) {
    const article = await this.repository.findOne(id);
    return !!article;
  }

  async update(id, data) {
    const isExist = await this.isArticleExist(id);
    if (!isExist) {
      throw new Error(`Article with ${id} not found`);
    }

    return this.repository.update(id, data);
  }

  async delete(id) {
    const isExist = await this.isArticleExist(id);
    if (!isExist) {
      throw new Error(`Article with ${id} not found`);
    }

    return this.repository.drop(id);
  }


  async createComment(id, data) {
    const isExist = await this.isArticleExist(id);
    if (!isExist) {
      throw new Error(`Article with ${id} not found`);
    }

    return this.commentRepository.create(id, data);
  }

  async deleteComment(articleId, commentId) {
    const isArticleExist = await this.isArticleExist(articleId);
    const comment = await this.commentRepository.findOne(commentId);
    if (!isArticleExist || !comment) {
      throw new Error(`Article or comment not found`);
    }
    return this.commentRepository.drop(commentId);
  }
}

module.exports = ArticleService;
