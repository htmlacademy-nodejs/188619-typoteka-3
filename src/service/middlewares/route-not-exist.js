'use strict';

const {getLogger} = require(`../lib/logger`);
const {HttpCode} = require(`../../constants`);
const logger = getLogger({name: `api`});

module.exports = (req, res) => {
  res.status(HttpCode.NOT_FOUND)
    .send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
};
