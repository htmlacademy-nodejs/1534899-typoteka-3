"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Category extends Model {}

const defineCategory = (sequelize) =>
  Category.init(
      {
        name: {
          // eslint-disable-next-line new-cap
          type: DataTypes.STRING(255),
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

