'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {asyncHandler} = require(`../../utils`);

const myRouter = new Router();

// Страница MY
myRouter.get(`/`, async (req, res, next) => {
  const articles = await api.getArticles({comments: false});
  res.render(`my`, {articles});
});

// Получить все комментарии
myRouter.get(`/comments`, asyncHandler(async (req, res, next) => {
  let articles = await api.getArticles({comments: true});
  res.render(`comments`, {articles});
}));

// Удаление статьи
myRouter.post(`/:id`, asyncHandler((req, res, next) => {
  const {id} = req.params;
  api.removeArticle(id);
  res.redirect(`/my`);
}));

// Удаление коммента
myRouter.post(`/comments/:id`, asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  await api.removeComments(id);
  res.redirect(`/my/comments`);
}));

module.exports = myRouter;

