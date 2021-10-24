'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories()
  ]);
  res.render(`main`, {articles, categories});
});

mainRouter.get(`/search`, async (req, res) => {
  const {query: searchValue} = req.query;

  try {
    const articles = await api.search(searchValue);
    res.render(`search`, {articles, searchValue});
  } catch (e) {
    res.render(`search`, {articles: []});
  }
});

module.exports = mainRouter;
