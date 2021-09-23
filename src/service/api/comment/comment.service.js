"use strict";

const CommentRepository = require(`./comment.repository`);

class CommentService {
  constructor(sequelize) {
    this.repository = new CommentRepository(sequelize);
  }

  getAll({limit, needArticles}) {
    return this.repository.getAll({limit, needArticles});
  }

  findOne(id) {
    return this.repository.findOne(id);
  }

  delete(id) {
    return this.repository.drop(id);
  }
}

module.exports = CommentService;
