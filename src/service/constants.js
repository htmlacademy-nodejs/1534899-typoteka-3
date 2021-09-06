"use strict";

const TITLES_PATH = `./data/titles.txt`;
const ANNOUNCES_PATH = `./data/announces.txt`;
const CATEGORIES_PATH = `./data/categories.txt`;
const FULLTEXTS_PATH = `./data/fulltexts.txt`;

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const DEFAULT_COMMAND = `--help`;

const COUNT = process.argv.slice(3);

const EXIT_CODES = {
  codeSuccess: 0,
  codeFailure: 1,
};

const DATE = new Date().toLocaleDateString(undefined, {
  day: `2-digit`,
  month: `2-digit`,
  year: `numeric`,
  hour: `2-digit`,
  minute: `2-digit`,
  second: `2-digit`,
});

const USER_ARGV_INDEX = 2;

module.exports = {
  TITLES_PATH,
  ANNOUNCES_PATH,
  CATEGORIES_PATH,
  FULLTEXTS_PATH,
  DATE,
  USER_ARGV_INDEX,
  DEFAULT_COUNT,
  FILE_NAME,
  DEFAULT_COMMAND,
  COUNT,
  EXIT_CODES,
};

