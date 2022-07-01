'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/user`, route);

  route.post(`/`, async (req, res) => {
    const data = req.body;
    const result = await service.create(data);
    res.status(HttpCode.CREATED)
      .json(result);
  });

  route.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;
    const user = await service.findByEmail(email);
    if (!user) {
      res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.EMAIL);
      return;
    }
    
    res.status(HttpCode.OK).json(user);
  });
};

