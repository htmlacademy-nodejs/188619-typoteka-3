'use strict';

const filldb = require(`./filldb`);
const help = require(`./help`);
const version = require(`./version`);
const server = require(`./server`);

const Cli = {
  [filldb.name]: filldb,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
};

module.exports = {
  Cli
};
