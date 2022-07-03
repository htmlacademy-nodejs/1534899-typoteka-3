'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middleware/picture-upload`);
const mainRouter = new Router();

// Все категории GET
mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories});
});

// Добавление категории POST
mainRouter.post(`/categories`, async (req, res) => {
  const {'add-category': nameCategory} = req.body;
  try {
    await api.addCategory({name: nameCategory});
    res.redirect(`/categories`);
  } catch (err) {
    console.log(err);
  }
});

// Изменение или удаление категории POST
mainRouter.post(`/categories/:id`, async (req, res) => {
  const {action, category} = req.body;
  const {id} = req.params;
  try {
    if (action === `edit`) {
      await api.editCategory({name: category}, id);
    } else {
      await api.deleteCategory(id);
    }
    res.redirect(`/categories`);
  } catch (errors) {
    const categories = await api.getCategories();
    res.render(`all-categories`, {categories});
  }
});

// Регистрация нового пользователя
mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    avatar: file ? file.filename : ``,
    firstName: body[`name`],
    lastName: body[`surname`],
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`]
  };

  await api.createUser(userData);
  res.redirect(`/login`);
});

// Логин пользователя
mainRouter.post(`/login`, async (req, res) => {
  const {body} = req;
  const userData = {
    email: body[`email`],
    password: body[`password`],
  };
  await api.auth(userData);
  res.redirect(`/`);
});

// Роуты для регистрации и логина
mainRouter.get(`/login`, async (req, res) => {
  res.render(`authorization/login`);
});

mainRouter.get(`/register`, async (req, res) => {
  res.render(`authorization/signup`);
});

// Главная страница, получение статей с комментариями и категориями
mainRouter.get(`/`, async (req, res) => {
  const [
    articles,
    categories,
    popularArticles,
    lastComments
  ] = await Promise.all([
    api.getArticles(true),
    api.getCategories(),
    api.getPopularArticles(),
    api.getLastComments()
  ]);

  res.render(`main`, {articles, categories, popularArticles, lastComments});
});

// Страница поиска
mainRouter.get(`/search`, async (req, res, next) => {
  let result = [];
  if (req.query.search) {
    try {
      result = await api.search(req.query.search);
    } catch (e) {
      if (e.response.status !== 404) {
        next(e);
      }
    }
  }
  res.render(`search`, {
    searchQuery: req.query.search,
    result,
  });
});

module.exports = mainRouter;
