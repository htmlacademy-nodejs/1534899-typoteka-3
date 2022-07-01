'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const fs = require(`fs`).promises;

const search = require(`./search`);
const SearchService = require(`../data-service/search`);
const {HttpCode} = require(`../constants`);
const initDB = require(`../lib/init-db`);

const {
  CATEGORIES_PATH,
  ROLES_PATH,
} = require(`../constants`);

const mockData = [
  {
    "title": `Как собрать камни бесконечности`,
    "announce": `Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "user": `ivanov@example.com`,
    "categories": [
      `Программирование`,
      `Музыка`,
      `IT`,
      `За жизнь`,
      `Деревья`,
      `Кино`,
      `Без рамки`,
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": ` Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        "user": `petrov@example.com`,
        "text": `Хочу такую же футболку :-)`,
      },
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором! Хочу такую же футболку :-) Это где ж такие красоты?`,
      },
    ],
  },
  {
    "title": `Как начать программировать`,
    "announce": `Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения.`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Достичь успеха помогут ежедневные повторения. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь.`,
    "user": `petrov@example.com`,
    "categories": [
      `Кино`,
      `Железо`,
      `Разное`,
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Мне кажется или я уже читал это где-то?`,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы! Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Планируете записать видосик на эту тему? Хочу такую же футболку :-) Плюсую, но слишком много буквы!`,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного...`,
      },
    ],
  },
  {
    "title": `Ёлки. История деревьев`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "user": `ivanov@example.com`,
    "categories": [
      `Музыка`,
      `Без рамки`,
      `Железо`,
      `За жизнь`,
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Хочу такую же футболку :-)`,
      },
    ],
  },
  {
    "title": `Самый лучший музыкальный альбом этого года`,
    "announce": `Это один из лучших рок-музыкантов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "fullText": `Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "user": `ivanov@example.com`,
    "categories": [
      `IT`,
      `Разное`,
      `Программирование`,
      `Без рамки`,
      `За жизнь`,
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то? `,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы!`,
      },
      {
        "user": `ivanov@example.com`,
        "text": `Мне кажется или я уже читал это где-то? Согласен с автором! Плюсую, но слишком много буквы!`,
      },
    ],
  },
  {
    "title": `Как собрать камни бесконечности`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "fullText": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов. Программировать не настолько сложно, как об этом говорят. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "user": `petrov@example.com`,
    "categories": [
      `Программирование`,
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Планируете записать видосик на эту тему?`,
      },
      {
        "user": `petrov@example.com`,
        "text": `Совсем немного... Планируете записать видосик на эту тему?`,
      },
    ],
  },
];

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getCategories = async () => readContent(CATEGORIES_PATH);
const getRoles = async () => readContent(ROLES_PATH);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  const users = [
    {
      firstName: `Иван`,
      lastName: `Иванов`,
      email: `ivanov@example.com`,
      passwordHash: `ghfjgfjgfjgfjgh`,
      avatar: `avatar-1.png`,
      roleId: 1,
    },
    {
      firstName: `Пётр`,
      lastName: `Петров`,
      email: `petrov@example.com`,
      passwordHash: `fdfdjfkdfjdkf`,
      avatar: `avatar-2.png`,
      roleId: 2,
    },
    {
      firstName: `Сидоров`,
      lastName: `Сидр`,
      email: `sidorov@example.com`,
      passwordHash: `afsfafasf`,
      avatar: `avatar-3.png`,
      roleId: 3,
    },
  ];
  const rolesData = await getRoles();
  const categoriesData = await getCategories();

  await initDB(mockDB, {articlesData: mockData, categoriesData, rolesData, usersData: users});

  search(app, new SearchService(mockDB));
});

describe(`API returns articles based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `камни`.toLowerCase(),
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Two article found`, () => expect(response.body.length).toBe(2));
  test(`Article has correct id`, () => expect(response.body[0].id).toBe(5));
});

test(`API returns code 404 if nothing is found`, async () => {
  await request(app).get(`/search`).query({
    query: `Продам свою душу`,
  }).expect(HttpCode.NOT_FOUND);
});

test(`API returns code 400 when query string is absent`, async () => {
  await request(app).get(`/search`).expect(HttpCode.BAD_REQUEST);
});
