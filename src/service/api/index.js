'use strict';

const {Router} = require(`express`);
const articles = require(`./articles`);
const search = require(`./search`);
const categories = require(`./categories`);
const users = require(`./users`);
const comments = require(`./comments`);

const sequelize = require(`../lib/sequalize`);
const defineModels = require(`../models`);

const {
  SearchService,
  ArticleService,
  CategoryService,
  UserService,
  CommentService
} = require(`../data-service`);

defineModels(sequelize);

const app = new Router();

(async () => {
  search(app, new SearchService(sequelize));
  users(app, new UserService(sequelize));
  articles(app, new ArticleService(sequelize));
  categories(app, new CategoryService(sequelize));
  comments(app, new ArticleService(sequelize), new CommentService(sequelize));
})();

module.exports = app;

