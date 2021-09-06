'use strict';

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);
const {getLogger} = require(`../lib/logger`);
const {
  ExitCode,
} = require(`../../constants`);

const logger = getLogger({name: `api`});

module.exports = async (sequelize, {categories, articles}) => {
  const {Category, Article} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});
    await articleModel.addCategories(
        article.categories.map(
            (name) => categoryIdByName[name]
        )
    );
  });

  try {
    logger.info(`Trying to fill database...`);
    await Promise.all(articlePromises);
    logger.info(`Database filled successfully!`);
  } catch (error) {
    logger.error(`Database filling error: ${error.message}`);
    process.exit(ExitCode.error);
  }
};
