'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middleware/picture-upload`);
const auth = require(`../middleware/auth`);
const csrf = require(`csurf`);
const mainRouter = new Router();
const {prepareErrors} = require(`../../utils`);

const csrfProtection = csrf();
const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/categories`, auth, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories, user});
});

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
    const {user} = req.session;
    const categories = await api.getCategories();
    const validationMessages = prepareErrors(err);
    res.render(`all-categories`, {categories, user, validationMessages});
  }
});

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
    const {user} = req.session;
    const categories = await api.getCategories();
    const validationMessages = prepareErrors(errors);
    res.render(`all-categories`, {categories, user, validationMessages});
  }
});

mainRouter.get(`/register`, csrfProtection, async (req, res) => {
  res.render(`authorization/signup`, {csrfToken: req.csrfToken()});
});

mainRouter.post(`/register`, upload.single(`avatar`), csrfProtection, async (req, res) => {

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
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`authorization/signup`, {validationMessages});
  }
});


mainRouter.get(`/login`, csrfProtection, async (req, res) => {
  res.render(`authorization/login`, {csrfToken: req.csrfToken()});
});

mainRouter.post(`/login`, csrfProtection, async (req, res) => {
  const userData = {
    email: req.body[`email`],
    password: req.body[`password`],
  };

  try {
    const user = await api.auth(userData);
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
  res.redirect(`/login`);
});

// Main page
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

// Search
mainRouter.get(`/search`, async (req, res, next) => {
  const {user} = req.session;
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
    colorWrap: true,
    searchQuery: req.query.search,
    result,
    user
  });
});

module.exports = mainRouter;
