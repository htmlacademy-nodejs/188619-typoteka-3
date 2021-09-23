"use strict";

const ArticleRepository = require(`./article.repository`);

class ArticleService {
  constructor(sequelize) {
    this.repository = new ArticleRepository(sequelize);
  }

}

module.exports = ArticleService;
