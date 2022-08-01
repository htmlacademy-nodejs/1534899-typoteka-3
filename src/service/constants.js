"use strict";

const TITLES_PATH = `./data/titles.txt`;
const ANNOUNCES_PATH = `./data/announces.txt`;
const CATEGORIES_PATH = `./data/categories.txt`;
const FULL_TEXTS_PATH = `./data/fulltexts.txt`;
const COMMENTS_PATH = `./data/comments.txt`;

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const DEFAULT_COMMAND = `--help`;

const COUNT = process.argv.slice(3);

const EXIT_CODES = {
  SUCCESS: 0,
  FAILURE: 1,
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

const DEFAULT_PORT = 3000;

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const MAX_ID_LENGTH = 6;
const MAX_COMMENTS = 4;
const API_PREFIX = `/api`;

module.exports = {
  DEFAULT_PORT,
  TITLES_PATH,
  ANNOUNCES_PATH,
  CATEGORIES_PATH,
  FULL_TEXTS_PATH,
  COMMENTS_PATH,
  DATE,
  USER_ARGV_INDEX,
  DEFAULT_COUNT,
  FILE_NAME,
  DEFAULT_COMMAND,
  COUNT,
  EXIT_CODES,
  HttpCode,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  API_PREFIX,
  Env,
};

