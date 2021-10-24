'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const {
  ArticleService,
} = require(`../data-service`);
const articleValidator = require(`../middlewares/article-validator`);


module.exports = (app, ArticleService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await ArticleService.findAll();

    if (!articles) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with articles!`);
    }

    res.status(HttpCode.OK)
    .json(articles);
  });

  route.get(`/comments`, async (req, res) => {
    const comments = await ArticleService.allComments();

    if (!comments) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with articles!`);
    }

    res.status(HttpCode.OK)
    .json(comments);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await ArticleService.getOne(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with article!`);
    }

    res.status(HttpCode.OK)
    .json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = ArticleService.create(req.body);
  
    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;

    const article = await ArticleService.update(articleId, req.body);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with updating article!`);
    }
    res.status(HttpCode.OK)
    .json(article);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await ArticleService.drop(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with deleting article!`);
    }

    res.status(HttpCode.OK)
    .json(article);
  });

  route.get(`/:articleId/comments`, async (req, res) => {
    const {articleId} = req.params;
    const comments = await ArticleService.findAllComments(articleId);
    if (!comments) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with comments!`);
    }
    res.status(HttpCode.OK)
    .json(comments);
  });
};

