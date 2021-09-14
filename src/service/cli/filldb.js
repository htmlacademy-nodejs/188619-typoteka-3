'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const {
  ExitCode,
} = require(`../../constants`);

const {
  getRandomInt,
  getRandomSubarray,
  shuffle,
} = require(`../../utils`);

const Publications = {
  DEFAULT_COUNT: 1,
  MAX_COUNT: 1000
};

const MAX_ANNOUNCE_SENTENCES = 5;
const MAX_TEXT_SENTENCES = 15;
const MAX_COMMENTS_COUNT = 5;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const logger = getLogger({name: `api`});

const getContentFromFile = async (filtePath) => {
  try {
    const content = await fs.readFile(filtePath, `utf8`);
    return content.trim().split(/\r?\n/);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getTitle = (titles) => titles[getRandomInt(0, titles.length - 1)];

const getAnnounce = (sentences) => shuffle(sentences).slice(0, MAX_ANNOUNCE_SENTENCES).join(` `);

const getFullText = (sentences) => shuffle(sentences).slice(0, MAX_TEXT_SENTENCES).join(` `);

const getCategories = (categories) => getRandomSubarray(categories);

const getComments = (comments) => (
  Array(getRandomInt(0, MAX_COMMENTS_COUNT)).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (count, titles, sentences, categories, comments) => (
  Array(count).fill({}).map(() => ({
    title: getTitle(titles),
    announce: getAnnounce(sentences),
    fullText: getFullText(sentences),
    categories: getCategories(categories),
    comments: getComments(comments)
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    const [countArg] = args;
    const count = Number.parseInt(countArg, 10) || Publications.DEFAULT_COUNT;

    if (count > Publications.MAX_COUNT) {
      console.error(chalk.red(`Не больше ${Publications.MAX_COUNT} публикаций.`));
      process.exit(ExitCode.error);
    }

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.error);
    }
    logger.info(`Connection to database established`);

    const titles = await getContentFromFile(FILE_TITLES_PATH);
    const sentences = await getContentFromFile(FILE_SENTENCES_PATH);
    const categories = await getContentFromFile(FILE_CATEGORIES_PATH);
    const comments = await getContentFromFile(FILE_COMMENTS_PATH);

    const articles = generateArticles(count, titles, sentences, categories, comments);
    return initDatabase(sequelize, {articles, categories});
  }
};