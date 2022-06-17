"use strict";

const express = require(`express`);
const chalk = require(`chalk`);
const path = require(`path`);
const bodyParser = require(`body-parser`);

const mainRouter = require(`./routes/main-routes`);
const myRouter = require(`./routes/my-routes`);
const articlesRouter = require(`./routes/articles-routes`);

const app = express();

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);

app.use((req, res) => {
  res.status(404).render(`/home/maxim/Рабочий стол/1534899-typoteka-3/src/express/templates/errors/404.pug`);
});

app.use((req, res) => {
  res.status(500).render(`500`);
});

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);


app.listen(DEFAULT_PORT, (err) => {
  if (err) {
    console.log(chalk.red(`Something going wrong!`));
  }
  console.log(chalk.green(`Server listening at ${DEFAULT_PORT}`));
});
