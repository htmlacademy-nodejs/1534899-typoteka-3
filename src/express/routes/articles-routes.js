'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middleware/picture-upload`);

const articlesRouter = new Router();

// С главной страницы выбираешь категорию
articlesRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;

  const [category, categories, {articles}] = await Promise.all([
    api.getCategory(id),
    api.getCategories(true),
    api.getArticlesByCategory({id})
  ]);

  res.render(`articles-by-category`, {category, categories, articles});
});

// С главной переход на статью по ID
articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);
  res.render(`post`, {article});
}
);

// Добавление новой публикации ++
articlesRouter.get(`/add/new`, async (req, res, next) => {
  try {
    const categories = await api.getCategories();
    res.render(`post-new`, {categories});
  } catch (e) {
    next(e);
  }
});

// Редактирование публикации по id
articlesRouter.get(`/edit/:id`, async (req, res, next) => {
  const {id} = req.params;
  let article;
  let categories;
  try {
    [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories()
    ]);
  } catch (e) {
    next(e);
  }
  res.render(`post-edit`, {article, categories});
});

// Пост новой статьи
articlesRouter.post(`/add/new`, upload.single(`upload`), async (req, res, next) => {
  const {body, file} = req;
  try {
    const articleData = {
      title: body.title,
      createDate: body.createdAt,
      category: body.category,
      announce: body.announce,
      image: file ? file.filename : ``,
      fullText: body.fullText
    };

    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    try {
      const categories = await api.getCategories();
      res.render(`post-new`, {categories});
    } catch (err) {
      next(err);
    }
  }
});

// Редактирование статьи
articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res, next) => {
  const {id} = req.params;
  const {body, file} = req;
  let article;
  let categories;

  try {
    const articleData = {
      title: body.title,
      createDate: body.createdAt,
      category: body.category,
      announce: body.announce,
      image: file ? file.filename : ``,
      fullText: body.fullText
    };

    await api.updateArticle(articleData, id);
    res.redirect(`/my`);
  } catch (e) {
    try {
      [article, categories] = await Promise.all([
        api.getArticle(id),
        api.getCategories()
      ]);
      res.render(`post-edit`, {article, categories});
    } catch (err) {
      next(err);
    }
  }
});

// Публикация комментария
articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;
  try {
    await api.createComment(id, {text: message, userId: 1});
    res.redirect(`back`);
  } catch (errors) {
    const article = await api.getArticle(id, true);
    res.render(`post`, {article});
  }
});

module.exports = articlesRouter;
