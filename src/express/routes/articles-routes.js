'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const pictureUpload = require(`../middleware/picture-upload`);

const articlesRouter = new Router();

articlesRouter.get(`/add`, (req, res) => {
  res.render(`articles/post-new`, {articleData: {}});
});

articlesRouter.get(`/:id`, (req, res) => {
  res.send(`/articles//articles/:id`);
});


articlesRouter.get(`/category/:id`, (req, res) => {
  res.send(`/articles/category/:id`);
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  res.render(`articles/post-edit`, {article});
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
