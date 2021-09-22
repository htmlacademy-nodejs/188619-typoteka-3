'use strict';

const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

module.exports = (error, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${error.message}`);
};
