'use strict';

const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

module.exports = (req, res, next) => {
  logger.info(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
};
