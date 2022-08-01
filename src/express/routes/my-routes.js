'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {asyncHandler} = require(`../../utils`);
const auth = require(`../middleware/auth`);
const {prepareErrors} = require(`../../utils`);

const myRouter = new Router();

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

myRouter.get(`/categories`, auth, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories, user});
});

myRouter.post(`/categories`, async (req, res) => {
  const {'add-category': nameCategory} = req.body;
  try {
    const result = await api.addCategory({name: nameCategory});
    if (result) {
      res.redirect(`/my/categories`);
    } else {
      const categories = await api.getCategories();
      res.render(`all-categories`, {categories});
    }
  } catch (err) {
    const {user} = req.session;
    const categories = await api.getCategories();
    const validationMessages = prepareErrors(err);
    res.render(`all-categories`, {categories, user, validationMessages});
  }
});

myRouter.post(`/categories/:id`, async (req, res) => {
  const {action, category} = req.body;
  const {id} = req.params;
  try {
    if (action === `edit`) {
      await api.editCategory({name: category}, id);
    } else {
      await api.deleteCategory(id);
    }
    res.redirect(`/my/categories`);
  } catch (errors) {
    const {user} = req.session;
    const categories = await api.getCategories();
    const validationMessages = prepareErrors(errors);
    res.render(`all-categories`, {categories, user, validationMessages});
  }
});

myRouter.get(`/comments`, auth, asyncHandler(async (req, res, _next) => {
  const {user} = req.session;
  let articles = await api.getArticles({comments: true});
  res.render(`comments`, {articles, user});
}));

myRouter.post(`/:id`, asyncHandler((req, res, _next) => {
  const {id} = req.params;
  api.removeArticle(id);
  res.redirect(`/my`);
}));

myRouter.post(`/comments/:id`, asyncHandler(async (req, res, _next) => {
  const {id} = req.params;
  await api.removeComments(id);
  res.redirect(`/my/comments`);
}));

module.exports = myRouter;

