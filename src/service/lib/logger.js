"use strict";

const fs = require(`fs`);
const path = require(`path`);
const pino = require(`pino`);
const {Env} = require(`../../constants`);

const LOG_DIR = `./logs`;
const LOG_FILE = `api.log`;

const isDevMode = process.env.NODE_ENV !== Env.PRODUCTION;
const defaultLogLevel = isDevMode ? `info` : `error`;

const getLogDir = () => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
  }
  return path.join(LOG_DIR, LOG_FILE);
};

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  prettyPrint: isDevMode
}, isDevMode ? process.stdout : pino.destination(getLogDir()));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
