'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

// Страница MY
myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles({});
  res.render(`../templates/my.pug`, {articles});
});

// Получить все комментарии
myRouter.get(`/comments`, async (req, res, next) => {
  let articles = [];
  try {
    articles = await api.getArticles({comments: true});
  } catch (e) {
    next(e);
  }
  res.render(`comments`, {articles});
});

// Удаление статьи
myRouter.post(`/:id`, async (req, res, next) => {
  const {id} = req.params;
  try {
    await api.removeArticle(id);
  } catch (e) {
    next(e);
  }
  res.redirect(`/my`);
});

// Удаление коммента
myRouter.post(`/comments/:id`, async (req, res, next) => {
  const {id} = req.params;
  try {
    await api.removeComments(id);
  } catch (e) {
    next(e);
  }
  res.redirect(`/my/comments`);
});

module.exports = myRouter;

