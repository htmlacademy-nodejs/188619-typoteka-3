'use strict';

const {Cli} = require(`./cli`);

const USER_ARGV_INDEX = 2;
const DEFAULT_COMMAND = `--help`;
const SUCCESS_EXIT_CODE = 0;

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(SUCCESS_EXIT_CODE);
}

Cli[userCommand].run(userArguments.slice(1));
