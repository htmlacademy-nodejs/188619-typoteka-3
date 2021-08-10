'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const {HttpCode} = require(`../../constants`);
const routes = require(`../api`);

const API_PREFIX = `/api`;
const DEFAULT_PORT = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.use(API_PREFIX, routes);

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
