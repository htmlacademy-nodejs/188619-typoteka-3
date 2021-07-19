'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);
const {
  getRandomInt,
  getRandomDate,
  shuffle,
} = require(`../../utils`);

const Publications = {
  DEFAULT_COUNT: 1,
  MAX_COUNT: 1000,
};

const FILE_NAME = `mocks.json`;
const MAX_MONTHS_AGO = 3;
const MAX_ANNOUNCE_SENTENCES = 5;
const MAX_TEXT_SENTENCES = 15;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

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
  const dateISO = getRandomDate(startDate, endDate).toISOString();
  const [date, time] = dateISO.slice(0, -5).split(`T`);
  return date + ` ` + time;
};

const getTitle = (titles) => titles[getRandomInt(0, titles.length - 1)];

const getAnnounce = (sentences) => shuffle(sentences).slice(0, MAX_ANNOUNCE_SENTENCES).join(` `);

const getFullText = (sentences) => shuffle(sentences).slice(0, MAX_TEXT_SENTENCES).join(` `);

const getCategory = (categories) => shuffle(categories).slice(0, getRandomInt(1, categories.length - 1));

const generatePublications = ({count, titles, sentences, categories}) => (
  Array(count).fill({}).map(() => ({
    title: getTitle(titles),
    createdDate: getCreatedDate(),
    announce: getAnnounce(sentences),
    fullText: getFullText(sentences),
    сategory: getCategory(categories),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [countArg] = args;
    const count = Number.parseInt(countArg, 10) || Publications.DEFAULT_COUNT;

    if (count > Publications.MAX_COUNT) {
      console.error(chalk.red(`Не больше ${Publications.MAX_COUNT} публикаций.`));
      process.exit(ExitCode.error);
    }

    const titles = await getContentFromFile(FILE_TITLES_PATH);
    const sentences = await getContentFromFile(FILE_SENTENCES_PATH);
    const categories = await getContentFromFile(FILE_CATEGORIES_PATH);
    const content = JSON.stringify(generatePublications({count, titles, sentences, categories}));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Операция выполнена. Файл создан.`));
      process.exit(ExitCode.success);
    } catch (err) {
      console.error(chalk.red(`Не удалось записать данные в файл...`));
      process.exit(ExitCode.error);
    }
  }
};
