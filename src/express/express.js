"use strict";

const express = require(`express`);
const chalk = require(`chalk`);
const path = require(`path`);

const mainRouter = require(`./routes/main-routes`);
const myRouter = require(`./routes/my-routes`);
const articlesRouter = require(`./routes/articles-routes`);

const app = express();

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT, (err) => {
  if (err) {
    console.log(chalk.red(`Something going wrong!`));
  }
  console.log(chalk.green(`Server listening at ${DEFAULT_PORT}`));
});
