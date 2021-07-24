'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {HttpCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const app = express();
app.use(express.json());

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.get(`/posts`, async (req, res) => {
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        res.json(mocks);
      } catch (err) {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
      }
    });

    app.use((req, res) => res
      .status(HttpCode.NOT_FOUND)
      .send(`Not found`));

    app.listen(port, () => {
      console.info(chalk.green(`Ожидаю соединений на ${port}`));
    }).on(`error`, (err) => {
      console.error(chalk.red(`Ошибка при создании сервера: ${err}`));
    });
  }
};
