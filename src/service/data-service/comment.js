"use strict";

class CommentService {
  constructor(offers) {
    this._offers = offers;
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

module.exports = CommentService;
