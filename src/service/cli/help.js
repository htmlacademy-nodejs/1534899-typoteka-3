"use strict";

module.exports = {
  name: `--help`,
  run() {
    console.log(
        `Команды:
         --version: выводит номер версии
         --help:    печатает этот текст
         --generate <count> формирует файл mocks.json`
    );
  },
};
