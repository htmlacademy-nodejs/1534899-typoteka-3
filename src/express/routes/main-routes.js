'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => {
  res.send(`/`);
});

mainRouter.get(`/register`, (req, res) => {
  res.render(`errors/500`);
});

mainRouter.get(`/login`, (req, res) => {
  res.render(`errors/404`);
});

mainRouter.get(`/search`, (req, res) => {
  res.send(`/search`);
});

mainRouter.get(`/categories`, (req, res) => {
  res.send(`/categories`);
});

module.exports = mainRouter;
