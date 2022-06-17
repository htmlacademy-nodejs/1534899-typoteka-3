"use strict";

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {articlesData, categoriesData, rolesData, usersData}) => {
  const {Category, Role, User, Article} = await defineModels(sequelize);
  await sequelize.sync({force: true});
  const categoryModels = await Category.bulkCreate(
      categoriesData.map((item) => ({name: item}))
  );
  await Role.bulkCreate(
      rolesData.map((item) => ({name: item}))
  );
  let userModels;
  try {
    userModels = await User.bulkCreate(usersData, {include: [Aliase.ARTICLES, Aliase.COMMENTS]});
  } catch (e) {
    console.log(e);
  }
  const userIdByEmail = userModels.reduce((acc, next) => ({
    [next.email]: next.id,
    ...acc
  }), {});

  articlesData.forEach((article) => {
    article.userId = userIdByEmail[article.user];
    article.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.user];
    });
  });

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const articlePromises = articlesData.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});
    await articleModel.addCategories(
        article.categories.map(
            (name) => categoryIdByName[name]
        )
    );
  });
  await Promise.all(articlePromises);

};
