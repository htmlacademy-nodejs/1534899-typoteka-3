"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Comment extends Model {}

const defineComment = (sequelize) => Comment.init({
  text: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(255),
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
