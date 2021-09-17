"use strict";

const chalk = require(`chalk`);
const express = require(`express`);
const fs = require(`fs`).promises;
const {DEFAULT_PORT, HttpCode, COUNT, FILE_NAME} = require(`../constants`);

const app = express();
app.use(express.json());

const [customPort] = COUNT;
const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.send([]);
  }
});

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
