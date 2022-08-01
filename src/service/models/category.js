"use strict";

const {DataTypes, Model} = require(`sequelize`);
const {STRING_LENGTH} = require(`../constants`);

class Category extends Model {}

const defineCategory = (sequelize) =>
  Category.init(
      {
        name: {
          // eslint-disable-next-line new-cap
          type: DataTypes.STRING(STRING_LENGTH),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        modelName: `Category`,
        tableName: `categories`,
      }
  );

module.exports = defineCategory;

