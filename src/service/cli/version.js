"use strict";

const packageJSON = require(`../../../package.json`);
const chalk = require(`chalk`);


module.exports = {
  name: `--version`,
  run() {
    console.log(chalk.blue(`Version is ${packageJSON.version}`));
  },
};
