'use strict';

const axios = require(`axios`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }
  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
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

  async createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }
}

const TIMEOUT = 1000;

const port = 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};

