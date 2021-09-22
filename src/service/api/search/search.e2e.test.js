"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {HttpCode} = require(`../../../constants`);
const search = require(`./search`);
const DataRepository = require(`../../data-repository/search`);
const initDB = require(`../../lib/init-db`);
const {mockCategories, mockData, mockUsers} = require(`../../../mocks`);

const createAPI = (service) => {
  const app = express();
  app.use(express.json());
  search(app, service);
  return app;
};

describe(`GET /search - Searching by query string`, () => {
  describe(`Serching exist offer by valid query string`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/search`).query({
        query: `Топ лайфхаки для тебя`,
      });
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`1 offer should be found`, () => {
      expect(response.body.length).toBe(1);
    });

    test(`Returns correct offers`, async () => {
      const serviceResult = await dataRepository.findAll(`Топ лайфхаки для тебя`);
      const serchResult = response.body;
      expect(serchResult[0].title).toEqual(serviceResult[0].title);
      expect(serchResult[0].announce).toEqual(serviceResult[0].announce);
      expect(serchResult[0].fullText).toEqual(serviceResult[0].fullText);
    });
  });

  describe(`Serching non-exist article by valid query string`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/search`).query({
        query: `Продам свою душу`,
      });
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`0 offers should be found`, () => {
      expect(response.body.length).toBe(0);
    });
  });

  describe(`Serching article by empty query string`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/search`);
    });

    test(`Status code should be 400`, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`0 offers should be found`, () => {
      expect(response.body.length).toBe(0);
    });
  });
});
