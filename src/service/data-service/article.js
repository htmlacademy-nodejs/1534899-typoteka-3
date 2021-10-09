"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../constants`);


class ArticleService {
  constructor(articlesData) {
    this._articlesData = articlesData;
  }

  findAll() {
    const articles = this._articlesData.reduce((acc, article) => {
      acc.add(article);
      return acc;
    }, new Set());

    return [...articles];
  }

  getOne(id) {
    const article = this._articlesData.filter((item) => item.id === id);
    return article;
  }
  create(article) {
    const newArticle = Object
      .assign({id: nanoid(MAX_ID_LENGTH), comments: []}, article);

    this._articlesData.push(newArticle);
    return newArticle;
  }

  createOne({title, category, announce, fullText}) {
    let newArticle;
    newArticle.title = title;
    newArticle.category = category;
    newArticle.announce = announce;
    newArticle.fullText = fullText;
    return newArticle;
  }

  drop(id) {
    const article = this._articlesData.find((item) => item.id === id);
    if (!article) {
      return null;
    }
    this._articlesData = this._articlesData.filter((item) => item.id !== id);
    return article;
  }

  update(id, article) {
    const oldArticle = this._articlesData
      .find((item) => item.id === id);

    return Object.assign(oldArticle, article);
  }

  findAllComments(id) {
    const article = this._articlesData.filter((item) => item.id === id);
    const comments = article[0].comments.reduce((acc, comment) => {
      acc.add(comment.text);
      return acc;
    }, new Set());
    return [...comments];
  }
}

module.exports = ArticleService;
