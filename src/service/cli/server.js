"use strict";

const express = require(`express`);
const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);
const routes = require(`../api`);
const apiLogger = require(`../middlewares/api-logger`);
const routeNotExist = require(`../middlewares/route-not-exist`);
const apiError = require(`../middlewares/api-error`);

const API_PREFIX = `/api`;
const DEFAULT_PORT = 3000;

const app = express();
const logger = getLogger({name: `api`});
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(apiLogger);
app.use(API_PREFIX, routes);
app.use(routeNotExist);
app.use(apiError);

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      logger.info(`Connection to database established`);
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      throw err;
    }

    app
      .listen(port, () => {
        return logger.info(`Listening to connections on ${port}`);
      })
      .on(`error`, (err) => {
        return logger.error(
            `An error occurred on server creation: ${err.message}`
        );
      });
  },
};
