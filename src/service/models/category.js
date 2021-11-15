'use strict';

const {DataTypes, Model} = require('sequelize');

class Category extends Model {}

const defineCategory = (sequelize) => Category.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: `Category`,
    tableName: `categories`,
  });
  
  module.exports = defineCategory;

