'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {asyncHandler} = require(`../../utils`);
const auth = require(`../middleware/auth`);

const myRouter = new Router();

// Страница MY

myRouter.get(`/`, auth, async (req, res, next) => {
  const {user} = req.session;
  let articles = [];
  try {
    articles = await api.getArticles({comments: false});
  } catch (e) {
    next(e);
  }
  res.render(`my`, {articles, user});
});

// Получить все комментарии
myRouter.get(`/comments`, auth, asyncHandler(async (req, res, next) => {
  const {user} = req.session;
  let articles = await api.getArticles({comments: true});
  res.render(`comments`, {articles, user});
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

