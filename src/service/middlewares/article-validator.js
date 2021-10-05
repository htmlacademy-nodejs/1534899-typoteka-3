'use strict';

const {HttpCode} = require(`../constants`);
const articleKeys = [`title`, `category`, `announce`, `fullText`, `createdDate`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));
  if (!keysExists) {
    res.status(HttpCode.NOT_FOUND)
      .send(`Bad request`);
  }
  next();
};
