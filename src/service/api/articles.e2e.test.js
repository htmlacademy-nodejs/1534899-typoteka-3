"use strict";

const express = require(`express`);
const request = require(`supertest`);

const articles = require(`./articles`);
const ArticleService = require(`../data-service/article`);
const {HttpCode} = require(`../constants`);

const mockData = [
  {
    id: `FA_Mms`,
    title: `Железо.`,
    category: [`Рок — это протест.`],
    announce:
      `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Ёлки — это не просто красивое дерево. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Где нет опасности, не может быть и славы. `,
    createdDate: `2021-10-01 23:08:24`,
    comments: [
      {
        id: `LOclmV`,
        text: `Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        id: `5s99ty`,
        text: `Хочу такую же футболку :-) Планируете записать видосик на эту тему?`,
      },
      {
        id: `Khazxs`,
        text: `Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором!`,
      },
    ],
  },
  {
    id: `Q-rcg4`,
    title: `Кино.`,
    category: [`Учим HTML и CSS.`],
    announce:
      `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?. Это один из лучших рок-музыкантов. Первая большая ёлка была установлена только в 1938 году. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Каждому свое красиво.`,
    createdDate: `2021-10-01 23:08:24`,
    comments: [
      {
        id: `4Dj6AZ`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Планируете записать видосик на эту тему?`,
      },
      {
        id: `q01US9`,
        text: `Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
    ],
  },
  {
    id: `kQVAhV`,
    title: `Программирование.`,
    category: [`Как достигнуть успеха не вставая с кресла.`],
    announce:
      `Из под его пера вышло 8 платиновых альбомов. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    fullText: `Каждому свое красиво.`,
    createdDate: `2021-10-01 23:08:24`,
    comments: [
      {
        id: `GV1XmM`,
        text: `Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        id: `2zrJ2G`,
        text: `Это где ж такие красоты?`,
      },
      {
        id: `JQ-eJH`,
        text: `Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
    ],
  },
  {
    id: `jfVZ0n`,
    title: `Музыка.`,
    category: [`Как достигнуть успеха не вставая с кресла.`],
    announce:
      `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Это один из лучших рок-музыкантов.`,
    fullText: `Красота — это обещание счастья.`,
    createdDate: `2021-10-01 23:08:24`,
    comments: [
      {
        id: `MWUBVd`,
        text: `Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        id: `GBueqT`,
        text: `Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        id: `S8h-my`,
        text: `Хочу такую же футболку :-)`,
      },
      {
        id: `EN8Ydd`,
        text: `Это где ж такие красоты?`,
      },
    ],
  },
  {
    id: `OSNDrp`,
    title: `Без рамки.`,
    category: [`Как собрать камни бесконечности.`],
    announce:
      `Простые ежедневные упражнения помогут достичь успеха. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    fullText: `Каждому свое красиво.`,
    createdDate: `2021-10-01 23:08:24`,
    comments: [
      {
        id: `XAVBgO`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        id: `2PCqRB`,
        text: `Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Планируете записать видосик на эту тему?`,
      },
      {
        id: `BznWie`,
        text: `Согласен с автором! Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
    ],
  },
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new ArticleService(cloneData));
  return app;
};

describe(`API returns articles list`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 5 articles`, () =>
    expect(response.body.length).toBe(5));
});

describe(`API returns one article with id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/:articleId`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Test`,
    category: `Погладь киску`,
    announce: `Here we go!`,
    fullText: `Something going on!`,
    createdDate: `28-01-1988`,
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Test1`,
    category: `Погладь киску1`,
    announce: `Here we go!1`,
    fullText: `Something going on!1`,
    createdDate: `28-01-19881`,
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.NOT_FOUND);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Test1`,
    category: `Погладь киску1`,
    announce: `Here we go!1`,
    fullText: `Something going on!1`,
    createdDate: ``,
    comments:[],
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/FA_Mms`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/FA_Mms`)
    .expect((res) => expect(res.body[0].title).toBe(`Test1`))
  );
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});
