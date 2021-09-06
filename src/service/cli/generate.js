"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  TITLES_PATH,
  ANNOUNCES_PATH,
  CATEGORIES_PATH,
  FULLTEXTS_PATH,
  DATE,
  DEFAULT_COUNT,
  FILE_NAME,
  COUNT,
  EXIT_CODES,
} = require(`../constants`);

const {getRandomInt, shuffle} = require(`../../utils`);

const generateOffers = (count, titles, announces, categories, fulltexts) =>
  Array(count)
    .fill({})
    .map(() => ({
      title: titles[getRandomInt(0, titles.length - 1)],
      category: [categories[getRandomInt(0, categories.length - 1)]],
      announce: shuffle(announces).slice(1, 5).join(` `),
      fullText: fulltexts[getRandomInt(0, fulltexts.length - 1)],
      createdDate: DATE,
    }));

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(err);
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run() {
    if (COUNT > 1000) {
      console.error(chalk.red(`Не больше 1000 публикаций!`));
      process.exit(EXIT_CODES.codeSuccess);
    }

    const categories = await readContent(CATEGORIES_PATH);
    const announces = await readContent(ANNOUNCES_PATH);
    const fulltexts = await readContent(FULLTEXTS_PATH);
    const titles = await readContent(TITLES_PATH);

    const countOffer = Number.parseInt(COUNT, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer, categories, announces, titles, fulltexts));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(EXIT_CODES.codeSuccess);
    } catch (err) {
      console.error(chalk.red(err));
    }
  },
};
