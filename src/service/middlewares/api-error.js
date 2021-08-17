'use strict';

const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

module.exports = (err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
};
