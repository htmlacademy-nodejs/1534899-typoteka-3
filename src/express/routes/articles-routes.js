'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middleware/picture-upload`);
const {prepareErrors} = require(`../../utils`);
const csrf = require(`csurf`);
const auth = require(`../middleware/auth`);

const articlesRouter = new Router();
const csrfProtection = csrf();

const OFFERS_PER_PAGE = 8;

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
  try {
    const categories = await api.getCategories();
    res.render(`post-new`, {user, categories, csrfToken: req.csrfToken()});
  } catch (e) {
    next(e);
  }
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res, next) => {
  const {user} = req.session;
  const {body, file} = req;
  try {
    const articleData = {
      userId: user.id,
      title: body.title,
      createDate: body.createdAt,
      categories: body.category,
      announce: body.announce,
      image: file ? file.filename : ``,
      fullText: body.fullText
    };
    const result = await api.createArticle(articleData);

    if (result) {
      res.redirect(`/my`);
    } else {
      const categories = await api.getCategories();
      res.render(`post-new`, {categories});
    }
  } catch (e) {
    const validationMessages = prepareErrors(e);
    try {
      const categories = await api.getCategories();
      res.render(`post-new`, {user, categories, validationMessages});
    } catch (err) {
      next(err);
    }
  }
});

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;
  let {page = 1} = req.query;
  const {user} = req.session;
  page = +page;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [category, categories, {count, articles}] = await Promise.all([
    api.getCategory(id),
    api.getCategories(true),
    api.getArticlesByCategory({id, limit, offset})
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`articles-by-category`, {category, categories, user, page, totalPages, articles});
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const article = await api.getArticle(id, true);
  res.render(`post`, {article, user, csrfToken: req.csrfToken()});
}
);

articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
  const {id} = req.params;
  let article;
  let categories;
  try {
    [article, categories] = await Promise.all([
      api.getArticle(id, false),
      api.getCategories()
    ]);
  } catch (e) {
    next(e);
  }
  res.render(`post-edit`, {user, article, categories, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), auth, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
  const {id} = req.params;
  const {body, file} = req;
  let article;
  let categories;

  try {
    const articleData = {
      userId: user.id,
      title: body.title,
      createDate: body.createdAt,
      categories: body.category,
      announce: body.announce,
      image: file ? file.filename : ``,
      fullText: body.fullText
    };

    await api.updateArticle(articleData, id);
    res.redirect(`/my`);
  } catch (e) {
    try {
      const validationMessages = prepareErrors(e);
      [article, categories] = await Promise.all([
        api.getArticle(id),
        api.getCategories()
      ]);
      res.render(`post-edit`, {user, article, categories, validationMessages});
    } catch (err) {
      next(err);
    }
  }
});

articlesRouter.post(`/:id/comments`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;
  try {
    await api.createComment(id, {text: message, userId: user.id});
    res.redirect(`back`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await api.getArticle(id, true);
    res.render(`post`, {article, validationMessages, user});
  }
});

module.exports = articlesRouter;
