'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../constants`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

const ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  ANON_MIN: `Анонс содержит меньше 30 символов`,
  ANON_MAX: `Анонс не может содержать более 250 символов`,
  ANON_NULL: `Анонс не может быть пустой`,
  DESCRIPTION_MAX: `Полный текст не может содержать более 1000 символов`,
  REQUIRED_CATEGORIES: `Не выбраны категории`,
  REQUIRED_DESCRIPTION: `Не заполнен полный текст`,
  PICTURE: `Изображение не выбрано или тип изображения не поддерживается`,
  USER_ID: `Некорректный идентификатор пользователя`,
  REQUIRED_USER_ID: `Идентификатор пользователя обязателен`
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES,
      })
  ).min(1).required().messages({
    'any.required': ErrorArticleMessage.REQUIRED_CATEGORIES
  }),
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX
  }),
  fullText: Joi.string().max(1000).allow(``).messages({
    'string.max': ErrorArticleMessage.DESCRIPTION_MAX,
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.ANON_MIN,
    'string.max': ErrorArticleMessage.ANON_MAX,
    'string.empty': ErrorArticleMessage.ANON_NULL,
  }),
  upload: Joi.string().allow(``),
  image: Joi.string().allow(``),
  createDate: Joi.string().allow(``),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorArticleMessage.USER_ID,
    'any.required': ErrorArticleMessage.REQUIRED_USER_ID
  })
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    logger.error(`Bad request`);
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
