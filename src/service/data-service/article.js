"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../constants`);


class ArticleService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    const articles = this._offers.reduce((acc, offer) => {
      acc.add(offer);
      return acc;
    }, new Set());

    return [...articles];
  }

  getOne(id) {
    const article = this._offers.filter((item) => item.id === id);
    return article;
  }
  create(offer) {
    const newOffer = Object
      .assign({id: nanoid(MAX_ID_LENGTH), comments: []}, offer);

    this._offers.push(newOffer);
    return newOffer;
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
    const article = this._offers.find((item) => item.id === id);
    if (!article) {
      return null;
    }
    this._offers = this._offers.filter((item) => item.id !== id);
    return article;
  }

  updateOne(id, data) {
    const article = this._offers.filter((item) => item.id === id);
    article[0].title = data.title;
    article[0].category = data.category;
    article[0].announce = data.announce;
    article[0].fullText = data.fullText;
    return article;
  }

  findAllComments(id) {
    const article = this._offers.filter((item) => item.id === id);
    const comments = article[0].comments.reduce((acc, comment) => {
      acc.add(comment.text);
      return acc;
    }, new Set());
    return [...comments];
  }
}

module.exports = ArticleService;
