"use strict";

class CategoryService {
  constructor(articlesData) {
    this._articlesData = articlesData;
  }

  findAll() {
    const categories = this._articlesData.reduce((acc, article) => {
      article.category.forEach((category) => acc.add(category));
      return acc;
    }, new Set());
    return [...categories];
  }
}

module.exports = CategoryService;

