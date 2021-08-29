
"use strict";

const {Cli} = require(`./cli`);
const {USER_ARGV_INDEX, DEFAULT_COMMAND} = require(`./constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(0);
}

Cli[userCommand].run(userArguments.slice(1));
