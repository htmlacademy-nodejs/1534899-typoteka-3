"use strict";

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._Article = sequelize.models.Article;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }
  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [Sequelize.fn(`COUNT`, Sequelize.col(`articleCategories.CategoryId`)), `count`]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory, as: Aliase.ARTICLE_CATEGORIES, attributes: []
        }]
      });
      return result.map((it) => it.get());
    }
    return this._Category.findAll({raw: true});
  }

  async create(categoryName) {
    const checkingExistingCategory = await this._Category.findOne({where: {name: `${categoryName}`}});
    let newCategory;
    try {
      if (checkingExistingCategory) {
        return newCategory;
      } else {
        const categoryToCreate = {name: `${categoryName}`};
        newCategory = await this._Category.create(categoryToCreate, {raw: true});
      }
    } catch (err) {
      console.log(err);
    }
    return newCategory;
  }

  async findOne(id, isCount) {
    if (isCount) {
      const result = await this._Category.findByPk(id, {
        where: {id},
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`CategoryId`)
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: []
        }],
        raw: true,
      });
      return result;
    }
    return this._Category.findByPk(id);
  }

  async update(id, categoryName) {
    const updatedRows = await this._Category.update({
      name: categoryName
    }, {
      where: {id}
    });

    return updatedRows;
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CategoryService;

