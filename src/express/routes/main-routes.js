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
    await api.addCategory(nameCategory);
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
      await api.editCategory(category, id);
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
mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
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

// Логин пользователя --No BODY с формы
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
  res.render(`../templates/authorization/login.pug`);
});

mainRouter.get(`/register`, async (req, res) => {
  res.render(`../templates/authorization/signup.pug`);
});

mainRouter.get(`/`, async (req, res) => {
  let categories;
  let articles;
  await Promise.all([
    articles = await api.getArticles(),
    categories = await api.getCategories()
  ]);

  res.render(`main`, {articles, categories});
});

mainRouter.get(`/search`, async (req, res) => {
  const {query: searchValue} = req.query;

  try {
    const articles = await api.search(searchValue);
    res.render(`search`, {articles, searchValue});
  } catch (err) {
    res.render(`search`, {articles: []});
  }
});

module.exports = mainRouter;
