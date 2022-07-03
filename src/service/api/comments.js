'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});
const articleExist = require(`../middlewares/article-exists`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.post(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const comment = await commentService.create(article.id, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });

  route.get(`/comments/last`, async (req, res) => {
    const comments = await commentService.lastComment();
    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/comments/:commentId`, async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.drop(commentId);

    if (!deletedComment) {
      logger.error(`Not found`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });
};