"use strict";

const {Cli} = require(`./cli`);
const {USER_ARGV_INDEX, DEFAULT_COMMAND, EXIT_CODES} = require(`./constants`);

console.log(process.env.DB_NAME);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(EXIT_CODES.FAILURE);
}

Cli[userCommand].run(userArguments.slice(1));

