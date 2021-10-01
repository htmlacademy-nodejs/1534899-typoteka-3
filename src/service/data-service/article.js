class ArticleService {
    constructor(offers) {
      this._offers = offers;
    }
  
    findAll() {
      const articles = this._offers.reduce((acc, offer) => {
        acc.add( offer.announce);
        return acc;
      }, new Set());
  
      return [...articles];
    }
  }
  
  module.exports = ArticleService;