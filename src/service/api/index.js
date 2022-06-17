'use strict';

const {Router} = require(`express`);
const articles = require(`./articles`);
const search = require(`./search`);
const categories = require(`./categories`);
const users = require(`./users`)

const sequelize = require(`../lib/sequalize`);
const defineModels = require(`../models`);


const {
  SearchService,
  ArticleService,
  CategoryService,
  UserService
} = require(`../data-service`);

defineModels(sequelize);

const app = new Router();

(async () => {
  // search(app, new SearchService(mockData));
  users(app, new UserService(sequelize));
  articles(app, new ArticleService(sequelize));
  categories(app, new CategoryService(sequelize));
})();

module.exports = app;

