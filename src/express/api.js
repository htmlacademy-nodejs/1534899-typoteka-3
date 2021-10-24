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

  getArticles() {
    return this._load(`/articles`);
  }

  getCategories() {
    return this._load(`/categories`);
  }
  getComments() {
    return this._load(`/articles/comments`);
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
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

