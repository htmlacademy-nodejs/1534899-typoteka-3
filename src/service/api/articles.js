const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req,res) => {
    const articles = await service.findAll();

    if(!articles){
      res.status(HttpCode.NOT_FOUND)
        .send(`Something going wrong with articles!`);
    }

    res.status(HttpCode.OK)
    .json(articles);
  })
}
