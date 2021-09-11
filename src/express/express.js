"use strict";

const express = require(`express`);
const chalk = require(`chalk`);
const mainRouter = require(`./routes/main-routes`);
const myRouter = require(`./routes/my-routes`);
const articlesRouter = require(`./routes/articles-routes`);

const app = express();

const DEFAULT_PORT = 8080;

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);

app.listen(DEFAULT_PORT, (err) => {
  if (err) {
    console.log(chalk.red(`Something going wrong!`));
  }
  console.log(chalk.green(`Server listening at ${DEFAULT_PORT}`));
});
