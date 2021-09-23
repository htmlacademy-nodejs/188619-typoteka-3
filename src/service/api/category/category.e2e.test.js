"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {HttpCode} = require(`../../../constants`);
const category = require(`./category`);
const DataRepository = require(`./category.repository`);
const initDB = require(`../../lib/init-db`);
const {mockCategories, mockData, mockUsers} = require(`../../../mocks`);

const createAPI = (service) => {
  const app = express();
  app.use(express.json());
  category(app, service);
  return app;
};

describe(`GET /categories - Getting list of all categories`, () => {
  describe(`Getting list if categories exist`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/categories`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body should be equal to data categories`, () => {
      expect(response.body[0].name).toEqual(mockCategories[0]);
    });
  });

  describe(`Getting list if articles doesn't exist`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: [], articles: [], users: []});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/categories`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body length should be equal to 0`, () => {
      expect(response.body.length).toBe(0);
    });
  });
});

describe(`GET /categories/:id - Get category`, () => {
  describe(`Getting list if categories exist`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/categories/1`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body should be equal to data categories`, () => {
      expect(response.body.name).toEqual(`За жизнь`);
    });
  });

  describe(`Getting list if category doesn't exist`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: [], articles: [], users: []});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/categories/100`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body length should be equal to 0`, () => {
      expect(response.body).toBe(null);
    });
  });

  describe(`Getting list if category is inavalid`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: [], articles: [], users: []});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/categories/INVALID`);
    });

    test(`Status code should be 400 `, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});
