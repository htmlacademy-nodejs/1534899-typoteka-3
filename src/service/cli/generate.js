"use strict";

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
const fs = require(`fs`);

const { getRandomInt, shuffle } = require(`../../utils`);

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
  run() {
    if (COUNT > 1000) {
      console.log(`Не больше 1000 публикаций!`);
      process.exit(EXIT_CODES.codeSuccess);
    }
    const countOffer = Number.parseInt(COUNT, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer));
    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        console.error(`Can't write data to file...`);
        process.exit(EXIT_CODES.codeFailure);
      }
      console.info(`Operation success. File created.`);
      process.exit(EXIT_CODES.codeSuccess);
    });
  },
};
