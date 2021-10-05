'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);
const {
  ArticleService,
  CommentService,
} = require(`../data-service`);
const articleValidator = require(`../middlewares/article-validator`);

const route = new Router();

module.exports = (app, ArticleService, CommentService) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {

    const articles = await ArticleService.findAll();

    if (!articles) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with articles!`);
    }

    res.status(HttpCode.OK)
    .json(articles);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await ArticleService.getOne(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with article!`);
    }

    res.status(HttpCode.OK)
    .json(article);
  });

  // route.post(`/`, articleValidator, async (req, res) => {
  //   const {title, category, announce, fullText, createdDate} = req.body;
  //   const article = {
  //     title,
  //     category,
  //     announce,
  //     fullText,
  //     createdDate,
  //   };
  //   const newArticle = await ArticleService.create(article);

  //   if (!newArticle) {
  //     res.status(HttpCode.BAD_REQUEST)
  //       .send(`Something going wrong with creation!`);
  //   }

  //   res.status(HttpCode.CREATED)
  //   .json(newArticle);
  // });

  route.post(`/`, articleValidator, (req, res) => {
    const article = ArticleService.create(req.body);
  
    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, async (req, res) => {
    const {offerId} = req.params;
    const article = await ArticleService.updateOne({id: offerId, offer: req.body});

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with updating article!`);
    }

    res.status(HttpCode.OK)
    .json(article);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await ArticleService.drop(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with deleting article!`);
    }

    res.status(HttpCode.OK)
    .json(article);
  });

  route.get(`/:articleId/comments`, async (req, res) => {
    const {articleId} = req.params;
    const comments = await ArticleService.findAllComments(articleId);

    if (!comments) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with comments!`);
    }

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.get(`/:articleId/comments`, async (req, res) => {
    const {articleId} = req.params;
    const comments = await CommentService.findAllComments(articleId);
    if (!comments) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with comments!`);
    }
    res.status(HttpCode.OK)
    .json(comments);
  });

  // route.delete(`/:articleId/comments`, async (req, res) => {
  //   const {articleId} = req.params;
  //   const comments = await CommentService.findAllComments(articleId);
  //   if (!comments) {
  //     res.status(HttpCode.NOT_FOUND)
  //       .send(`Something going wrong with comments!`);
  //   }
  //   res.status(HttpCode.OK)
  //   .json(comments);
  // });

};

// route.get(`/:offerId/comments`, [routeParamsValidator, offerExist(offerService)], async (req, res) => {
//   const {offerId} = req.params;

//   const comments = await commentService.findAll(offerId);

//   res.status(HttpCode.OK)
//     .json(comments);

// });

// route.post(`/:offerId/comments`, [routeParamsValidator, offerExist(offerService), commentValidator], async (req, res) => {
//   const {offerId} = req.params;

//   const comment = await commentService.create(offerId, req.body);

//   return res.status(HttpCode.CREATED)
//     .json(comment);
// });

// route.delete(`/:offerId/comments/:commentId`, [routeParamsValidator, offerExist(offerService)], async (req, res) => {
//   const {offerId, commentId} = req.params;
//   const {userId} = req.body;

//   const comment = await commentService.findOne(commentId, offerId);

//   if (!comment) {
//     return res.status(HttpCode.NOT_FOUND)
//       .send(`Not found`);
//   }

//   const deletedComment = await commentService.drop(userId, offerId, commentId);

//   if (!deletedComment) {
//     return res.status(HttpCode.FORBIDDEN)
//       .send(`Forbidden`);
//   }

//   return res.status(HttpCode.OK)
//     .json(deletedComment);
// });