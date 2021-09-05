"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  TITLES,
  ANNOUNCES,
  CATEGORIES,
  FULLTEXTS,
  DATE,
  DEFAULT_COUNT,
  FILE_NAME,
  COUNT,
  EXIT_CODES,
} = require(`../constants`);

const {getRandomInt, shuffle} = require(`../../utils`);

const generateOffers = (count) =>
  Array(count)
    .fill({})
    .map(() => ({
      title: TITLES[getRandomInt(0, TITLES.length - 1)],
      category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
      announce: shuffle(ANNOUNCES).slice(1, 5).join(` `),
      fullText: FULLTEXTS[getRandomInt(0, FULLTEXTS.length - 1)],
      createdDate: DATE,
    }));

module.exports = {
  name: `--generate`,
  async run() {
    if (COUNT > 1000) {
      console.error(chalk.red(`Не больше 1000 публикаций!`));
      process.exit(EXIT_CODES.codeSuccess);
    }
    const countOffer = Number.parseInt(COUNT, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(EXIT_CODES.codeSuccess);
    } catch (err) {
      console.error(chalk.red(err));
    }
  },
};
