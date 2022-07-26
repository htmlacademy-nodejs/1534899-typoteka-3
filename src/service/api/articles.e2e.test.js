"use strict";

const fs = require(`fs`).promises;
const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`); 

const articles = require(`./articles`);
const ArticleService = require(`../data-service/article`);
const {HttpCode, CATEGORIES_PATH} = require(`../constants`);
const passwordUtils = require(`../lib/password`);

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

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  const users = [
    {
      firstName: `Иван`,
      lastName: `Иванов`,
      email: `ivanov@example.com`,
      passwordHash: await passwordUtils.hash(`ivanov`),
      avatar: `avatar-1.png`,
    },
    {
      firstName: `Пётр`,
      lastName: `Петров`,
      email: `petrov@example.com`,
      passwordHash: await passwordUtils.hash(`petrov`),
      avatar: `avatar-2.png`,
    },
    {
      firstName: `Сидоров`,
      lastName: `Сидр`,
      email: `sidorov@example.com`,
      passwordHash: await passwordUtils.hash(`sidorov`),
      avatar: `avatar-3.png`,
    },
  ];

  const categoriesData = await getCategories();

  await initDB(mockDB, {articlesData: mockData, categoriesData, usersData: users});
  const app = express();
  app.use(express.json());
  articles(app, new ArticleService(mockDB));
  return app;
};

describe(`API returns all articles`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    userId: 1,
    title: `Обзор новейшего смартфона Обзор новейшего смартфона`,
    createDate: `2020-10-21`,
    categories: [`1`, `2`],
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    image: ``,
    fullText: `Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );

});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
    category: `Железо`,
    fullText: `Полный текст`,
    userId: 1
  };

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      const app = await createAPI();
      await request(app).post(`/articles`).send(badArticle).expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    userId: 1,
    title: `Обзор новейшего смартфона Обзор новейшего смартфона`,
    createDate: `2020-10-21`,
    categories: [`1`, `2`, `3`, `7`, `8`, `9`],
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    image: ``,
    fullText: `Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/2`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Post is really changed`, () => request(app)
    .get(`/articles/2`)
    .expect((res) => expect(res.body.title).toBe(`Обзор новейшего смартфона Обзор новейшего смартфона`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();

  const validPost = {
    userId: 4,
    title: `Обзор новейшего смартфона Обзор новейшего смартфона`,
    createDate: `2020-10-21`,
    categories: [`1`, `2`, `3`, `7`, `8`, `9`],
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    image: ``,
    fullText: `Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  };

  return await request(app)
    .put(`/articles/20`)
    .send(validPost)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 404 when trying to change an article with invalid data`, async () => {
  const invalidArticle = {
    title: `Валидный заголовок`,
    category: `Железо`,
    fullText: `Полный текст`,
    userId: 1
  };

  const app = await createAPI();

  await request(app).put(`/articles/1`).send(invalidArticle).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Articles count is 4 now`, async () => {
    await request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(4));
  });
});

test(`API returns to delete non-existent article`, async () => {
  const app = await createAPI();
  await request(app).delete(`/articles/89`).expect(HttpCode.NOT_FOUND);
});

test(`When field type is wrong response code is 400`, async () => {
  const newArticle = {
    userId: true,
    title: `Обзор новейшего смартфона Обзор новейшего смартфона`,
    createDate: `2020-10-21`,
    categories: [`1`, `2`, `3`, `7`, `8`, `9`],
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    image: ``,
    fullText: `Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  };
  const app = await createAPI();

  const badArticles = [
    {...newArticle, announce: true},
    {...newArticle, title: `title`},
    {...newArticle, categories: []}
  ];
  for (const badArticle of badArticles) {
    await request(app)
      .post(`/articles`)
      .send(badArticle)
      .expect(HttpCode.BAD_REQUEST);
  }
});