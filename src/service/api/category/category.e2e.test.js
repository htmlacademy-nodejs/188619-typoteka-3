"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {HttpCode} = require(`../../../constants`);
const category = require(`./category`);
const DataService = require(`./category.service`);
const initDB = require(`../../lib/init-db`);
const {mockCategories, mockData, mockUsers} = require(`../../../mocks`);

const createAPI = (db) => {
  const app = express();
  app.use(express.json());
  category(app, new DataService(db));
  return app;
};

describe(`GET /categories - Getting list of all categories`, () => {
  describe(`Getting list if categories exist`, () => {
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      const app = createAPI(mockDB);
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
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: [], articles: [], users: []});
      const app = createAPI(mockDB);
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
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      const app = createAPI(mockDB);
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
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: [], articles: [], users: []});
      const app = createAPI(mockDB);
      response = await request(app).get(`/categories/100`);
    });

    test(`Status code should be 404 `, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`Getting list if category is inavalid`, () => {
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: [], articles: [], users: []});
      const app = createAPI(mockDB);
      response = await request(app).get(`/categories/INVALID`);
    });

    test(`Status code should be 400 `, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`DELETE /categories/:id - Deleting category`, () => {
  describe(`Deleting category without articles`, () => {
    let response = null;
    let service = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      service = new DataService(mockDB);
      const app = createAPI(mockDB);
      response = await request(app).delete(`/categories/4`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Category is deleted`, async () => {
      const serviceResult = await service.findOne(4);
      expect(serviceResult).toEqual(null);
    });
  });

  describe(`Deleting category with articles`, () => {
    let response = null;
    let service = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      const app = createAPI(mockDB);
      service = new DataService(mockDB);
      response = await request(app).delete(`/categories/1`);
    });

    test(`Status code should be 400 `, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Category is not deleted`, async () => {
      const serviceResult = await service.findOne(1);
      expect(serviceResult.name).toEqual(`За жизнь`);
    });
  });
});
