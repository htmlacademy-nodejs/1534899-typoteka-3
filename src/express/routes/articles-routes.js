'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const pictureUpload = require(`../middleware/picture-upload`);

const articlesRouter = new Router();

articlesRouter.get(`/:id`, (req, res) => {
  res.send(`/articles//articles/:id`);
});


articlesRouter.get(`/category/:id`, (req, res) => {
  res.send(`/articles/category/:id`);
});

// Добавление новой публикации ++
articlesRouter.get(`/add`, (req, res) => {
  res.render(`articles/post-new`, {articleData: {}});
});


// Редактирование публикации по id
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  let article;
  let categories;
  try {
    article = await api.getArticle(id);
    categories = await api.getCategories();
    res.render(`../templates/articles/post-edit.pug`, {article, categories});
  } catch (err) {
    res.send(err);
  }
});

articlesRouter.post(`/add`, pictureUpload.single(`img`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    title: body.title,
    createDate: body.date,
    category: [],
    announce: body.announce,
    picture: file ? file.filename : ``,
    fullText: body.fullText
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    res.render(`articles/post-new`, {articleData});
  }
});

module.exports = articlesRouter;
