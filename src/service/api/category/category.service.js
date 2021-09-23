"use strict";

const CategoryRepository = require(`./category.repository`);
const ArticleRepository = require(`../article/articles.repository`);

class CategoryService {
  constructor(sequelize) {
    this.repository = new CategoryRepository(sequelize);
    this.articleRepository = new ArticleRepository(sequelize);
  }

  findAll(needCount) {
    if (needCount) {
      return this.repository.findAllAndCount();
    }
    return this.repository.findAll();
  }

  findOne(id) {
    return this.repository.findOne(id);
  }

  update(id, data) {
    return this.repository.update(id, data);
  }

  async delete(id) {
    const {count} = await this.articleRepository.getPage({limit: 1, offset: 1, categoryId: id});
    if (count) {
      throw new Error(`Невозможно удалить категорию, т.к. она содержит публикации`);
    }

    return this.repository.drop(id);
  }
}

module.exports = CategoryService;
