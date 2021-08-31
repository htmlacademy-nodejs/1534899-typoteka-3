"use strict";

const packageJSON = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    console.log(`Version is >>>`, packageJSON.version);
  },
};


