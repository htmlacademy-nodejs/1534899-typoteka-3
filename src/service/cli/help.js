"use strict";

const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    console.log(
        chalk.grey(
            `Команды:
          --version: выводит номер версии
          --help:    печатает этот текст
          --generate <count> формирует файл mocks.json`
        )
    );
  },
};
