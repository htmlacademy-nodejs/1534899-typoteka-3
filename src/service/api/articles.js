'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {

    const articles = await service.findAll();

    if (!articles) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with articles!`);
    }

    res.status(HttpCode.OK)
    .json(articles);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await service.getOne(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with article!`);
    }

    res.status(HttpCode.OK)
    .json(article);
  });

  route.post(`/`, async (req, res) => {
    const {title, category, announce, fullText} = req.body;
    const dataForCreateArticle = {
      title,
      category,
      announce,
      fullText,
    };
    const newArticle = await service.createOne(dataForCreateArticle);

    if (!newArticle) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with creation!`);
    }

    res.status(HttpCode.OK)
    .json(newArticle);
  });

  route.put(`/:articleId`, async (req, res) => {
    const {offerId} = req.params;
    const article = await service.updateOne({id: offerId, offer: req.body});

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with updating article!`);
    }

    res.status(HttpCode.OK)
    .json(article);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await service.deleteOne(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with deleting article!`);
    }

    res.status(HttpCode.OK)
    .json(article);
  });

  route.get(`/:articleId/comments`, async (req, res) => {
    const {articleId} = req.params;
    const comments = await service.findAllComments(articleId);

    if (!comments) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with comments!`);
    }

    res.status(HttpCode.OK)
      .json(comments);
  });

};
