"use strict";

const axios = require(`axios`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({offset, limit, needComments, isCommented} = {}) {
    return this._load(`/articles`, {params: {offset, limit, needComments, isCommented}});
  }

  getArticle(id, {needComments, count} = {}) {
    return this._load(`/articles/${id}`, {params: {needComments, count}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories({count} = {}) {
    return this._load(`/categories`, {params: {count}});
  }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data,
    });
  }

  async editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      data
    });
  }

  async createComment(id, data) {
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

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: `POST`,
      data: {email, password}
    });
  }

  getComments({limit}) {
    return this._load(`/comments`, {params: {limit}});
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
