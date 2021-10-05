'use strict';

const {Router} = require(`express`);
const getMockData = require(`../lib/get-mock-data`);
const articles = require(`./articles`);
const search = require(`./search`);
const categories = require(`./categories`);
// const comments = require(`./comments`);

const {
  SearchService,
  ArticleService,
  CategoryService,
  // CommentService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();
  search(app, new SearchService(mockData));
  articles(app, new ArticleService(mockData));
  categories(app, new CategoryService(mockData));
  // comments(app, new CommentService(mockData));
})();

module.exports = app;

