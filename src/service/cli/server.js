"use strict";

const express = require(`express`);
const {getLogger} = require(`../lib/logger`);
const routes = require(`../api`);
const apiLogger = require(`../middlewares/api-logger`);
const routeExist = require(`../middlewares/route-exist`);
const apiErorr = require(`../middlewares/api-error`);

const API_PREFIX = `/api`;
const DEFAULT_PORT = 3000;

const app = express();
const logger = getLogger({name: `api`});
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(apiLogger);
app.use(API_PREFIX, routes);
app.use(routeExist);
app.use(apiErorr);

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app
      .listen(port, () => {
        return logger.info(`Listening to connections on ${port}`);
      })
      .on(`error`, (err) => {
        return logger.error(`An error occurred on server creation: ${err.message}`);
      });
  },
};
