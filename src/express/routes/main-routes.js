'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => {
  res.render(`main`);
});

mainRouter.get(`/register`, (req, res) => {
  res.render(`signup`);
});

mainRouter.get(`/login`, (req, res) => {
  res.render(`login`);
});

mainRouter.get(`/comments`, (req, res) => {
  res.render(`comments`);
});

mainRouter.get(`/search`, (req, res) => {
  res.render(`search-result`);
});

mainRouter.get(`/publications`, (req, res) => {
  res.render(`publications`);
});

mainRouter.get(`/post`, (req, res) => {
  res.render(`post`);
});

mainRouter.get(`/search`, (req, res) => {
  res.send(`/search`);
});

mainRouter.get(`/my`, (req, res) => {
  res.render(`my`);
});

mainRouter.get(`/categories`, (req, res) => {
  res.render(`all-categories`);
});

mainRouter.get(`/public`, (req, res) => {
  res.render(`articles-by-category`);
});

mainRouter.get(`/categories`, (req, res) => {
  res.send(`/categories`);
});

module.exports = mainRouter;
