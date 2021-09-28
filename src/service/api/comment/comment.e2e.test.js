"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {HttpCode} = require(`../../../constants`);
const comment = require(`./comment`);
const DataService = require(`./comment.service`);
const initDB = require(`../../lib/init-db`);
const {mockCategories, mockData, mockUsers} = require(`../../../mocks`);

const createAPI = (db) => {
  const app = express();
  app.use(express.json());
  comment(app, new DataService(db));
  return app;
};

describe(`GET /comments - Getting list of all comemnts`, () => {
  describe(`Getting list if comments exist`, () => {
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      const app = createAPI(mockDB);
      response = await request(app).get(`/comments`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body should be equal to data comments`, () => {
      expect(response.body.length).toEqual(15);
    });
  });

  describe(`Getting list if comments doesn't exist`, () => {
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: [], articles: [], users: []});
      const app = createAPI(mockDB);
      response = await request(app).get(`/comments`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body length should be equal to 0`, () => {
      expect(response.body.length).toBe(0);
    });
  });
});
