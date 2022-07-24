'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middleware/picture-upload`);
const csrf = require(`csurf`);
const mainRouter = new Router();
const {prepareErrors} = require(`../../utils`);

const csrfProtection = csrf();
const ARTICLES_PER_PAGE = 8;


// Все категории GET
mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories});
});

// Добавление категории POST
mainRouter.post(`/categories`, async (req, res) => {
  const {'add-category': nameCategory} = req.body;
  try {
    const result = await api.addCategory({name: nameCategory});
    if (result) {
      res.redirect(`/categories`);
    } else {
      const categories = await api.getCategories();
      res.render(`all-categories`, {categories});
    }
  } catch (err) {
    const categories = await api.getCategories();
    const validationMessages = prepareErrors(err);
    res.render(`all-categories`, {categories, validationMessages});
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

//*************************/ Регистрация нового пользователя /**********************************//

mainRouter.get(`/register`, async (req, res) => {
  res.render(`authorization/signup`);
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    avatar: file ? file.filename : ``,
    firstName: body[`firstname`],
    lastName: body[`lastname`],
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`]
  };

  try {
    const result = await api.createUser(userData);;
    res.redirect(`/login`);
  } catch (errors) {
    
    const validationMessages = prepareErrors(errors);
    res.render(`authorization/signup`, {validationMessages});
  }
});

//*************************/ Логин пользователя /**********************************//

// Роуты для регистрации и логина
mainRouter.get(`/login`, csrfProtection, async (req, res) => {
  res.render(`authorization/login`, {csrfToken: req.csrfToken()});
});

// mainRouter.get(`/login`, csrfProtection, (req, res) => res.render(`login`, {csrfToken: req.csrfToken()}));

// Логин пользователя
// mainRouter.post(`/login`, async (req, res) => {
//   const {body} = req;
  // const userData = {
  //   email: body[`email`],
  //   password: body[`password`],
  // };
//   await api.auth(userData);
//   res.redirect(`/`);
// });

mainRouter.post(`/login`, csrfProtection, async (req, res) => {
  const userData = {
    email: req.body[`email`],
    password: req.body[`password`],
  };
  console.log('userData', userData);

  try {
    const user = await api.auth(userData);
    console.log('user>>>', user);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render(`login`, {user, validationMessages});
  }
});

// Logout
mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

// Главная страница, получение статей с комментариями и категориями
mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  const {user} = req.session;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [
    {count, articles},
    categories,
    popularArticles,
    lastComments
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(),
    api.getPopularArticles(),
    api.getLastComments()
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {articles, page, totalPages, categories, user, popularArticles, lastComments});
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
