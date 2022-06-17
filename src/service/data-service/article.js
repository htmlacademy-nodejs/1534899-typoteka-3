"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../constants`);
const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
    this._Role = sequelize.models.Role;
    this._Comment = sequelize.models.Comment;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }
  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, {model: this._Comment, as: Aliase.COMMENTS, include: [Aliase.USERS]}],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });
    return {count, articles: rows};
  }
  async findAll() {
    const include = [Aliase.CATEGORIES];
    const article = await this._Article.findAll(
        {
          include,
        });
    return article.map((item) => item.get());
  }

  async getOne(id) {
    const article = await  this._Article.findOne( {
      where: {id: `${id}`},
      include: [{
        association: Aliase.CATEGORIES,
      }],
    });
    return article;
  }

  create(article) {
    const newArticle = Object.assign(
      { id: nanoid(MAX_ID_LENGTH), comments: [] },
      article
    );

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
    const oldArticle = this._articlesData.find((item) => item.id === id);

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

  allComments() {
    const comments = this._articlesData
      .map((item) => {
        return item.comments;
      })
      .flat();
    return comments;
  }
}

module.exports = ArticleService;
