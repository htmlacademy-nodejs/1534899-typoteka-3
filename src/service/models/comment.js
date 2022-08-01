"use strict";

const {DataTypes, Model} = require(`sequelize`);
const {STRING_LENGTH} = require(`../constants`);

class Comment extends Model {}

const defineComment = (sequelize) => Comment.init({
  text: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(STRING_LENGTH),
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: true,
  paranoid: true,
  modelName: `Comment`,
  tableName: `comments`,
});

module.exports = defineComment;
