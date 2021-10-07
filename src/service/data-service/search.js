"use strict";

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll(query) {
    const article = this._offers.filter((item) => item.title.includes(query));
    return article;
  }

}

module.exports = SearchService;

