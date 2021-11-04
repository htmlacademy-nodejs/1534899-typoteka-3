-- adding roles
INSERT INTO roles(name) VALUES
('admin'),
('guest'),
('reader'),
('author');

-- adding categories
INSERT INTO categories (name) VALUES 
('IT'),
('Железо'),
('За жизнь'),
('Без рамки'),
('Деревья'),
('Кино');

-- adding users
ALTER TABLE users DISABLE TRIGGER ALL;
INSERT INTO users(email, password_hash, first_name, last_name, avatar, role_id) VALUES
('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg', 1),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf98', 'Пётр', 'Петров', 'avatar2.jpg', 2),
('jukov@example.com', '5f4dcc3b5aa765d61d8327deb882cf97', 'Вася', 'Дулин', 'avatar3.jpg', 3),
('kotov@example.com', '5f4dcc3b5aa765d61d8327deb882cf96', 'Игорян', 'Жабов', 'avatar4.jpg', 2),
ALTER TABLE users ENABLE TRIGGER ALL;

-- adding articles
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles (user_id, title, created_at, announce, full_text, image)
VALUES (
  2,
  'Обзор новейшего смартфона',
  '2021-07-04T19:58:17+00:00',
  'Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят. Это один из лучших рок-музыкантов.',
  'Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.'
  ),
  (
  2,
  'Борьба с прокрастинацией',
  '2020-08-11T00:00:09+00:00',
  'Он написал больше 30 хитов.',
  'Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция.',
  ),
  (
  2,
  'Как собрать камни бесконечности',
  '2021-03-22T10:00:22+00:00',
  'Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.',
  'Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.',
  );
ALTER TABLE articles ENABLE TRIGGER ALL;

-- adding comments
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments (user_id, article_id, created_at, text)
VALUES (
  4,
  1,
  '2021-06-25T10:10:22+00:00',
  'Согласен с автором!'
  ),
  (
  2,
  1,
  '2021-04-09T16:05:59+00:00',
  'Это где ж такие красоты?'
  ),
  (
  4,
  2,
  '2021-04-09T12:05:03+00:00',
  'Мне кажется или я уже читал это где-то?'
  ),
  (
  4,
  2,
  '2021-01-01T00:30:50+00:00',
  'Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.'
  ),
  (
  2,
  3,
  '2021-02-26T10:07:36+00:00',
  'Планируете записать видосик на эту тему?'
  ),
  (
  2,
  3,
  '2021-07-21T23:59:17+00:00',
  'Совсем немного...'
  );
ALTER TABLE comments ENABLE TRIGGER ALL;

-- adding relations between articles and categories
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories (category_id, article_id)
VALUES (
  1,
  1
),
(
  2,
  1
),
(
  3,
  1
),
(
  5,
  1
),
(
  6,
  1
),
(
  3,
  2
),
(
  4,
  3
),
(
  5,
  3
),
(
  1,
  3
);
ALTER TABLE articles_categories ENABLE TRIGGER ALL;