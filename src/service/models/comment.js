'use strict';

const {DataTypes, Model} = require('sequelize');

class Comment extends Model {};

const defineComment = (sequelize) => ({
  text: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(255),
    allowNull: false,
  },
},{
  sequelize,
  modelName: `Comment`,
  tableName: `comments`,
});

module.exports = defineComment;