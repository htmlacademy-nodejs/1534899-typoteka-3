'use strict';

const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async lastComment() {
    return this._Comment.findAll({
      limit: 4,
      order: [
        [`createdAt`, `DESC`]
      ],
      include: [
        Aliase.USERS,
      ]
    });
  }

}

module.exports = CommentService;
