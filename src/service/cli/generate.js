"use strict";

const {
  TITLES_PATH,
  SENTENCES_PATH,
  CATEGORIES_PATH,
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

const generateOffers = (count, categories, sentences, titles) =>
  Array(count)
    .fill({})
    .map(() => ({
      category: [categories[getRandomInt(0, categories.length - 1)]],
      description: shuffle(sentences).slice(1, 5).join(` `),
      picture: getPictureFileName(),
      title: titles[getRandomInt(0, titles.length - 1)],
      type: OfferType[
        Object.keys(OfferType)[
          Math.floor(Math.random() * Object.keys(OfferType).length)
        ]
      ],
      sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    }));

const readContent = async (filePath) => {
  try {
    let content;
    content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};
module.exports = {
  name: `--generate`,
  async run() {
    if (COUNT > 1000) {
      console.error(chalk.red(`Не больше 1000 объявлений!`));
      process.exit(EXIT_CODES.codeSuccess);
    }

    const categories = await readContent(CATEGORIES_PATH);
    const sentences = await readContent(SENTENCES_PATH);
    const titles = await readContent(TITLES_PATH);

    const countOffer = Number.parseInt(COUNT, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer, categories, sentences, titles));

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
