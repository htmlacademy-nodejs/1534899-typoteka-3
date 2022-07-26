"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const sequelize = require(`../lib/sequalize`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});
const {getRandomInt, shuffle, getRandomDate, formatDate} = require(`../../utils`);
const initDB = require(`../lib/init-db`);

const {
  TITLES_PATH,
  ANNOUNCES_PATH,
  CATEGORIES_PATH,
  FULLTEXTS_PATH,
  COMMENTS_PATH,
  DEFAULT_COUNT,
  EXIT_CODES,
  MAX_COMMENTS,
} = require(`../constants`);

const generateComments = (count, comments, user) => {
  return Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
    user
  }));
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getCategories = async () => readContent(CATEGORIES_PATH);


const getUsers = () => [
  {
    firstName: `Иван`,
    lastName: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: `ghfjgfjgfjgfjgh`,
    avatar: `avatar-1.png`,
  },
  {
    firstName: `Пётр`,
    lastName: `Петров`,
    email: `petrov@example.com`,
    passwordHash: `fdfdjfkdfjdkf`,
    avatar: `avatar-2.png`,
  },
  {
    firstName: `Сидоров`,
    lastName: `Сидр`,
    email: `sidorov@example.com`,
    passwordHash: `afsfafasf`,
    avatar: `avatar-3.png`,
  },
];

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const generateArticles = async (count, categoriesData) => {
  const titles = await readContent(TITLES_PATH);
  const fullTexts = await readContent(FULLTEXTS_PATH);
  const announces = await readContent(ANNOUNCES_PATH);
  const commentsData = await readContent(COMMENTS_PATH);
  const usersData = await getUsers();
  return Array(count).fill({}).map(() => {
    const title = titles[getRandomInt(0, titles.length - 1)];
    const announce = shuffle(announces).slice(1, getRandomInt(2, 4)).join(` `);
    const fullText = shuffle(fullTexts).slice(1, getRandomInt(2, 4)).join(` `);
    const categories = getRandomSubarray(categoriesData);
    const user = usersData[getRandomInt(0, usersData.length - 1)].email;
    const comments = generateComments(getRandomInt(1, MAX_COMMENTS), commentsData, usersData[getRandomInt(0, usersData.length - 1)].email);
    const today = new Date();
    const startDate = new Date(new Date().setMonth(today.getMonth() - 11));
    const createdDate = formatDate(getRandomDate(startDate, today));
    return ({title, createdDate, fullText, announce, categories, comments, user});
  });
};

module.exports = {
  name: `--filldb`,
  async run(args) {

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countArticle > 1000) {
      logger.error(chalk.blue(`Не больше 1000 объявлений !`));
      process.exit(EXIT_CODES.FAILURE);
    }

    const categoriesData = await getCategories();
    const usersData = getUsers();

    const articlesData = await generateArticles(countArticle, categoriesData);

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      await initDB(sequelize, {articlesData, categoriesData, usersData});
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
    }
  },
};
