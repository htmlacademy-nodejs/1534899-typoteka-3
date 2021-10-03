"use strict";

class ArticleService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    const articles = this._offers.reduce((acc, offer) => {
      acc.add(offer.announce);
      return acc;
    }, new Set());

    return [...articles];
  }

  getOne(id) {
    const article = this._offers.filter((item) => item.id === id);
    return article;
  }

  createOne({title, category, announce, fullText}) {
    let newArticle;
    newArticle.title = title;
    newArticle.category = category;
    newArticle.announce = announce;
    newArticle.fullText = fullText;
    return newArticle;
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
