'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.put(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const categoryName = req.body.name;

    const category = await service.findOne(categoryId);

    if (!category) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const updated = await service.update(categoryId, categoryName);

    return res.status(HttpCode.OK).json(updated);
  });

  route.delete(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;

    const category = await service.findOne(categoryId, true);

    if (category.count > 1) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Не пустую категорию невозможно удалить`);
    }

    const deleted = await service.drop(categoryId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK).json(deleted);
  });

  route.post(`/`, async (req, res) => {
    const categoryName = req.body.name;
    try {
      const result = await service.create(categoryName);
      res.status(HttpCode.OK).json(result);
    } catch (err) {
      console.log(err);
    }
  });

  route.get(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const category = await service.findOne(categoryId);

    if (!category) {
      logger.error(`Not found with ${categoryId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${categoryId}`);
    }

    return res.status(HttpCode.OK)
      .json(category);
  });
};
