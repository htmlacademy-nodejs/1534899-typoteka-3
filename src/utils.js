"use strict";

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [
      someArray[randomPosition],
      someArray[i],
    ];
  }
  return someArray;
};

const ensureArray = (value) => Array.isArray(value) ? value : [value];

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const addZero = (int) => {
  return int < 10 ? `0` + int : int;
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = addZero(date.getMonth() + 1);
  const day = addZero(date.getDate());
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const seconds = addZero(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

module.exports = {
  getRandomInt,
  shuffle,
  ensureArray,
  getRandomDate,
  addZero,
  formatDate,
};
