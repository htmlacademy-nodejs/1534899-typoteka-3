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
    const offer = this._offers.find((item) => item.id === id);
    if (!offer) {
      return null;
    }
    this._offers = this._offers.filter((item) => item.id !== id);
    return offer;
  }

  uodateOne({id}) {
    const article = this._offers.filter((item) => item.id === id);
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
