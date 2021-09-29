const {Router} = require(`express`);
const articles = require(`./articles`);
const categories = require(`./categories`);
const search = require(`./search`);

const {
  CategoryService,
  SearchService,
  ArticleService,
} = require(`../data-service`);

const app = new Router;

(async () => {
  const mockData = await getMockData();
  categories(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  articles(app, new ArticleService(mockData)); // you can add here another Service
})();

module.exports = app;

