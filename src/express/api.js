'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;
const PORT = 3000;
const DEFAULT_URL = `http://localhost:${PORT}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  // Получение всех статей
  getArticles(comments) {
    return this._load(`/articles`, {params: {comments}});
  }

  // Получение всех популярных статей
  getPopularArticles() {
    return this._load(`/articles/popular`);
  }

  // Получение последних комментариев
  getLastComments() {
    return this._load(`/articles/comments/last`);
  }

  // Поиск статей
  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  // Получить категорию по ID
  getCategory(id) {
    return this._load(`/categories/${id}`);
  }

  // Создать новую категорию
  addCategory(data) {
    return this._load(`/categories/`, {
      method: `POST`,
      data
    });
  }

  // Получить все категории
  getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }
  // Получить статью по одной категории
  getArticlesByCategory({id}) {
    return this._load(`/articles/category/${id}`);
  }
  // Получить статью по ID
  getArticle(id, comments) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }
  // Создать новую статью
  createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }
  // Отредактировать статью по ID
  updateArticle(data, id) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      data
    });
  }
  // Удалить статью
  removeArticle(id) {
    return this._load(`/articles/${id}`, {
      method: `DELETE`,
    });
  }
  // Удалить коммент
  removeComments(id) {
    return this._load(`/articles/comments/${id}`, {
      method: `DELETE`,
    });
  }
  // Редактировать категорию
  editCategory(data, id) {
    return this._load(`/categories/${id}`, {
      method: `PUT`,
      data
    });
  }
  // Удалить категорию
  deleteCategory(id) {
    return this._load(`/categories/${id}`, {
      method: `DELETE`
    });
  }
  // Получить все комменты
  getComments() {
    return this._load(`/articles/comments`);
  }
  // Создать комментарий
  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: `POST`,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: `POST`,
      data
    });
  }

  auth(data) {
    return this._load(`/user/auth`, {
      method: `POST`,
      data
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }
}

const defaultAPI = new API(DEFAULT_URL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};

