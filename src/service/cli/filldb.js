'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const logger = getLogger({name: `api`});
const {
  ExitCode,
} = require(`../../constants`);

const {
  getRandomInt,
  getRandomSubarray,
  getRandomDate,
  shuffle,
} = require(`../../utils`);

const Publications = {
  DEFAULT_COUNT: 1,
  MAX_COUNT: 1000
};

const MAX_ANNOUNCE_SENTENCES = 3;
const MAX_TEXT_SENTENCES = 5;
const MAX_MONTHS_AGO = 3;
const MAX_COMMENTS_COUNT = 5;

const FilePath = {
  TITLES: `./data/titles.txt`,
  SENTENCES: `./data/sentences.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`
};

const getContentFromFile = async (filtePath) => {
  try {
    const content = await fs.readFile(filtePath, `utf8`);
    return content.trim().split(/\r?\n/);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getCreatedDate = () => {
  const endDate = new Date();
  const startDate = new Date(new Date().setMonth(endDate.getMonth() - MAX_MONTHS_AGO));
  return getRandomDate(startDate, endDate);
};

const getTitle = (titles) => titles[getRandomInt(0, titles.length - 1)];

const getAnnounce = (sentences) => shuffle(sentences).slice(0, MAX_ANNOUNCE_SENTENCES).join(` `);

const getFullText = (sentences) => shuffle(sentences).slice(0, MAX_TEXT_SENTENCES).join(` `);

const getCategories = (categories) => getRandomSubarray(categories);

const getComments = (comments, users) => (
  Array(getRandomInt(0, MAX_COMMENTS_COUNT)).fill({}).map(() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (count, titles, sentences, categories, comments, users) => (
  Array(count).fill({}).map(() => ({
    title: getTitle(titles),
    announce: getAnnounce(sentences),
    date: getCreatedDate(),
    fullText: getFullText(sentences),
    categories: getCategories(categories),
    comments: getComments(comments, users),
    user: users[0].email
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

    const titles = await getContentFromFile(FilePath.TITLES);
    const sentences = await getContentFromFile(FilePath.SENTENCES);
    const categories = await getContentFromFile(FilePath.CATEGORIES);
    const comments = await getContentFromFile(FilePath.COMMENTS);
    const users = [
      {
        name: `Иван`,
        surname: `Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar01.png`
      },
      {
        name: `Пётр`,
        surname: `Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar02.png`
      }
    ];

    const articles = generateArticles(count, titles, sentences, categories, comments, users);
    return initDatabase(sequelize, {articles, categories, users});
  }
};
