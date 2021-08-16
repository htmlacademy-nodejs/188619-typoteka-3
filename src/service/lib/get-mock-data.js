'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const FILENAME = `mocks.json`;
let data = null;

const getMockData = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(FILENAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.error(chalk.red(`Ошибка при чтении файла с данными: ${err}`));
  }

  return Promise.resolve(data);
};

module.exports = getMockData;
