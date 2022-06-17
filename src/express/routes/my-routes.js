'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles({});
  res.render(`../templates/my.pug`, {articles});
});

myRouter.get(`/`, async (req, res) => {


  // const articles = await api.getArticles({});
  // res.render(`../templates/my.pug`, {articles});
});

myRouter.post(`/:id`, async (req, res) => {
  console.log('Request params', req.params);
  console.log('Request body', req.body);

});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`comments`, {articles: articles.slice(0, 3)});
});

module.exports = myRouter;

