"use strict";

const {DataTypes, Model} = require(`sequelize`);
const {STRING_LENGTH} = require(`../constants`);

class Article extends Model {}

const defineArticle = (sequelize) => Article.init({
  title: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(STRING_LENGTH),
    allowNull: false,
  },
  fullText: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(STRING_LENGTH),
    allowNull: false,
  },
  announce: {
    // eslint-disable-next-line new-cap
    type: DataTypes. STRING(STRING_LENGTH),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  }
}, {
  sequelize,
  timestamps: true,
  paranoid: true,
  modelName: `Article`,
  tableName: `articles`,
});

module.exports = defineArticle;
