'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);


module.exports = (app, service) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const categories = await service.findAll();
    if (!categories) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with categories!`);
    }
    res.status(HttpCode.OK)
    .json(categories);
  });

  route.put(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const categoryName = req.body.data;

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

    console.log(`DELETE BACKEND`, categoryId)
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
    const categoryName = req.body.data;
    try {
      const result = await service.create(categoryName);
      res.status(HttpCode.OK).json(result);
    } catch (err) {
      console.log(err);
    }
  });

};
