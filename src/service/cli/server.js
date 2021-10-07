"use strict";

const express = require(`express`);
const {DEFAULT_PORT, HttpCode, COUNT, API_PREFIX} = require(`../constants`);
const routes = require(`../api/index`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

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
    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`An error occurred on server creation: ${err.message}`);
        }
        return logger.info(`Listening to connections on ${port}`);
      });
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
  },
};
