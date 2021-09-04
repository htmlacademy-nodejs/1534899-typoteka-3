"use strict";

const USER_ARGV_INDEX = 2;

const TITLES_PATH = `./data/titles.txt`;
const SENTENCES_PATH = `./data/sentences.txt`;
const CATEGORIES_PATH = `./data/categories.txt`;
const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const DEFAULT_COMMAND = `--help`;

const COUNT = process.argv.slice(3);

const EXIT_CODES = {
  codeSuccess: 0,
  codeFailure: 1,
};

const DEFAULT_PORT = 3000;

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

module.exports = {
  USER_ARGV_INDEX,
  TITLES_PATH,
  SENTENCES_PATH,
  CATEGORIES_PATH,
  SumRestrict,
  OfferType,
  PictureRestrict,
  DEFAULT_COUNT,
  FILE_NAME,
  DEFAULT_COMMAND,
  COUNT,
  EXIT_CODES,
  DEFAULT_PORT,
  HttpCode
};

