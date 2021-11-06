-- get all categories
SELECT * from categories

-- get non-empty category with at least one publication
SELECT id, name FROM categories
  JOIN articles_categories
  ON id = category_id
  GROUP BY id


-- get non-empty category with at least one publication
SELECT id, name, count(article_id) FROM categories
  LEFT JOIN articles_categories
  ON id = category_id
  GROUP BY id

-- get full info articles
SELECT
  articles.id,
  articles.title, 
  articles.created_at, 
  articles.announce, 
  COUNT(comments.id) AS comments_count, 
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_at DESC


-- get 5 comments
 SELECT 
  comments.id,
  comments.article_id,
  comments.full_text,
  users.first_name,
  users.last_name
  FROM comments
    JOIN users ON comments.user_id = users.id
    ORDER BY comments.created_at DESC
    LIMIT 5

-- All comments to article
SELECT 
  comments.id, 
  comments.article_id, 
  users.first_name, 
  users.last_name,
  comments.full_text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
  ORDER BY comments.created_at DESC

-- Update article
UPDATE articles
  SET title = 'Как я встретил Новый год'
  WHERE id = 1