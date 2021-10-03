"use strict";

const chalk = require(`chalk`);
const express = require(`express`);
const {DEFAULT_PORT, HttpCode, COUNT, API_PREFIX} = require(`../constants`);
const routes = require(`../api/index`);

const app = express();
app.use(express.json());
app.use(API_PREFIX, routes);


const [customPort] = COUNT;
const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

module.exports = {
  name: `--server`,
  run() {
    app.listen(port, (err) => {
      if (err) {
        console.log(chalk.red(`Something going wrong!`));
      }
      console.log(chalk.green(`Server listening on ${port}`));
    });
  },
};
