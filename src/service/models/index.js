'use strict';

const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineCategory = require(`./category`);
const defineUser = require(`./user`);
const Aliase = require(`./aliase`);
const {Model} = require(`sequelize`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);
  ArticleCategory.init({}, {sequelize, timestamps: false, modelName: `ArticleCategory`, tableName: `article_categories`});

  User.hasMany(Article, {as: Aliase.ARTICLES, foreignKey: `userId`, onDelete: `cascade`});
  Article.belongsTo(User, {foreignKey: `userId`});

  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `userId`, onDelete: `cascade`});
  Comment.belongsTo(User, {foreignKey: `userId`, as: Aliase.USERS});

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});

  return {Article, Category, Comment, User, ArticleCategory};
};

module.exports = define;
