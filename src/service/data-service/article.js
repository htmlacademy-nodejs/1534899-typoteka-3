"use strict";

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
    this._Role = sequelize.models.Role;
    this._Comment = sequelize.models.Comment;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }
  /////+++++
  async findAll(needComments) {
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];
    const orderArr = [
      [`createdAt`, `DESC`]
    ];
    if (needComments) {
      include.push({model: this._Comment, as: Aliase.COMMENTS, include: [Aliase.USERS]});
      orderArr.push([Aliase.COMMENTS, `createdAt`, `DESC`]);
    }
    const article = await this._Article.findAll(
        {
          include,
          order: orderArr,
        });
    return article.map((item) => item.get());
  }

  /////+++++
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
  /////+++++
  async popularArticles() {
    const options = {
      subQuery: false,
      limit: 4,
      attributes: {
        include: [
          [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `commentsCount`]
        ],
        exclude: [`title`, `image`, `fullText`, `createdAt`, `updatedAt`, `userId`]
      },
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [],
        }
      ],
      group: [
        `Article.id`,
      ],
      order: [
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `DESC`]
      ]
    };
    const popularActicles = await this._Article.findAll(options);
    return popularActicles.map((item) => item.get());
  }
  /////-----
  async findArticlesByCategory(categoryId) {
    const articlesIdByCategory = await this._ArticleCategory.findAll({
      attributes: [`ArticleId`],
      where: {
        CategoryId: categoryId
      },
      raw: true
    });

    const articlesId = articlesIdByCategory.map((articleIdItem) => articleIdItem.ArticleId);

    const {count, rows} = await this._Article.findAndCountAll({
      include: [
        Aliase.CATEGORIES,
        Aliase.COMMENTS,
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {
        id: articlesId
      },
      distinct: true
    });

    return {count, articles: rows};
  }

  async findOne(id, needComments) {
    let article;
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
      article = this._Article.findByPk(id, {
        include,
        order: needComments ? [
          [Aliase.COMMENTS, `createdAt`, `DESC`]
        ] : []});
    } else {
      article = await this._Article.findOne({
        where: {id: `${id}`},
        include: [{
          association: Aliase.CATEGORIES,
        }],
      });
    }
    return article;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }
  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async getOne(id) {
    const article = await this._Article.findOne({
      where: {id: `${id}`},
      include: [{
        association: Aliase.CATEGORIES,
      }],
    });
    return article;
  }
}

module.exports = ArticleService;
