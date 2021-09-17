'use strict';

const {Router} = require(`express`);

const myRouter = new Router();

myRouter.get(`/`, (req, res) => {
  // res.send(`/my`);
  res.render(`errors/404`);
  // res.render(`errors/500`);
});

myRouter.get(`/comments`, (req, res) => {
  // res.send(`/my`);
  res.render(`errors/500`);
  // res.render(`errors/500`);
});

module.exports = myRouter;

