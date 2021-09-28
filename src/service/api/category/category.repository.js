"use strict";

const Sequelize = require(`sequelize`);
const Aliase = require(`../../models/aliase`);

class CategoryRepository {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  findAll() {
    return this._Category.findAll({raw: true});
  }


  async findAllAndCount() {
    const result = await this._Category.findAll({
      attributes: [`id`, `name`, [Sequelize.fn(`COUNT`, Sequelize.col(`${Aliase.ARTICLE_CATEGORIES}.CategoryId`)), `count`]],
      group: [Sequelize.col(`Category.id`)],
      include: [
        {
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: [],
        },
      ],
    });

    return result.map((it) => it.get());
  }

  findOne(id) {
    return this._Category.findByPk(id);
  }

  create(categoryData) {
    return this._Category.create(categoryData);
  }

  update(id, categoryData) {
    return this._Category.update(categoryData, {
      where: {id}
    });
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id},
    });
    return !!deletedRows;
  }
}

module.exports = CategoryRepository;
