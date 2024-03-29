"use strict";

const express = require(`express`);
const {DEFAULT_PORT, HttpCode, COUNT, API_PREFIX, EXIT_CODES} = require(`../constants`);
const routes = require(`../api/index`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});
const sequelize = require(`../lib/sequalize`);
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND)
    .send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});

const [customPort] = COUNT;
const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

module.exports = {
  name: `--server`,
  async run() {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      app.listen(port, () => {
        return logger.info(`Listening to connections on ${port}`);
      });

    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(EXIT_CODES.FAILURE);
    }
  },
};
