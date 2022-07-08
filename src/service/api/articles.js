'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});
const articleValidator = require(`../middlewares/article-validator`);
const RouteParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/articles`, route);
 
  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;
    let result;
    if (limit || offset) {
      result = await service.findPage({limit, offset});
    } else {
      result = await service.findAll(comments);
    }
    
    res.status(HttpCode.OK).json(result);
  });

  route.get(`/popular`, async (req, res) => {
    const popularArticles = await service.popularArticles();
    if (!popularArticles) {
      logger.error(`Not found popular articles`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found popular articles`);
    }
    return res.status(HttpCode.OK)
      .json(popularArticles);
  });

  route.get(`/category/:id`, RouteParamsValidator, async (req, res) => {
    const {id} = req.params;

    const {count, articles} = await service.findArticlesByCategory(id);

    res.status(HttpCode.OK)
      .json({
        count,
        articles
      });
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;

    const article = await service.findOne(articleId, Boolean(comments));


    if (!article) {
      logger.error(`Not found with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }
    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await service.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, [articleValidator, RouteParamsValidator], async (req, res) => {
    const {articleId} = req.params;
    const existsArticle = await service.findOne(articleId);

    if (!existsArticle) {
      logger.error(`Not found with ${articleId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    const updatedArticle = await service.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedArticle);
  });

  route.delete(`/:articleId`, RouteParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const article = await service.drop(articleId);

    if (!article) {
      logger.error(`Not found`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }
    return res.status(HttpCode.OK)
      .json(article);
  });
};

