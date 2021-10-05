"use strict";

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll(query) {
    console.log(query);
  }

}

module.exports = SearchService;

