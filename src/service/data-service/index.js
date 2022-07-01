'use strict';

const ArticleService = require(`./article`);
const SearchService = require(`./search`);
const CategoryService = require(`./category`);
const UserService = require(`./user`);
const CommentService = require(`./comment`);

module.exports = {
  ArticleService,
  SearchService,
  CategoryService,
  UserService,
  CommentService,
};
