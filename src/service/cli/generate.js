"use strict";

const {
  TITLES,
  SENTENCES,
  CATEGORIES,
  SumRestrict,
  OfferType,
  DEFAULT_COUNT,
  FILE_NAME,
  PictureRestrict,
  COUNT,
  EXIT_CODES,
} = require(`../constants`);

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {getRandomInt, shuffle} = require(`../../utils`);

const getPictureFileName = () => {
  return `item${getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)}.jpg`;
};

const generateOffers = (count) =>
  Array(count)
    .fill({})
    .map(() => ({
      category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
      description: shuffle(SENTENCES).slice(1, 5).join(` `),
      picture: getPictureFileName(),
      title: TITLES[getRandomInt(0, TITLES.length - 1)],
      type: OfferType[
        Object.keys(OfferType)[
          Math.floor(Math.random() * Object.keys(OfferType).length)
        ]
      ],
      sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    }));

module.exports = {
  name: `--generate`,
  async run() {
    if (COUNT > 1000) {
      console.error(chalk.red(`Не больше 1000 объявлений!`));
      process.exit(EXIT_CODES.codeSuccess);
    }
    const countOffer = Number.parseInt(COUNT, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(EXIT_CODES.codeSuccess);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(EXIT_CODES.codeFailure);
    }
  },
};
