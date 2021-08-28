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
} = require(`../constants`);
const fs = require(`fs`);

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
  run() {
    const {argv} = process;
    const count = argv.slice(3);
    if (count > 1000) {
      console.log(`Не больше 1000 объявлений!`);
      process.exit(0);
    }
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer));
    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.info(`Operation success. File created.`);
    });
  },
};
