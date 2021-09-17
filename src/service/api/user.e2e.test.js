"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {HttpCode} = require(`../../constants`);
const user = require(`./user`);
const DataService = require(`../data-service/user`);
const initDB = require(`../lib/init-db`);
const {mockCategories, mockData, mockUsers} = require(`../../mocks`);

const createAPI = (service) => {
  const app = express();
  app.use(express.json());
  user(app, service);
  return app;
};

describe(`POST /user - Register new user`, () => {
  describe(`Register user with valid data`, () => {
    let dataService = null;
    let response = null;

    const validUserData = {
      name: `Сидор`,
      surname: `Сидоров`,
      email: `sidorov@example.com`,
      password: `sidorov`,
      passwordRepeated: `sidorov`,
      avatar: `sidorov.jpg`
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
      response = await request(app).post(`/user`).send(validUserData);
    });

    test(`Status code should be 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    test(`User created`, async () => {
      const result = await dataService.findByEmail(validUserData.email);
      expect(result.email).toEqual(validUserData.email);
      expect(result.name).toEqual(validUserData.name);
      expect(result.surname).toEqual(validUserData.surname);
    });
  });

  describe(`Register user without some keys`, () => {
    let dataService = null;
    let app = null;

    const validUserData = {
      name: `Сидор`,
      surname: `Сидоров`,
      email: `sidorov@example.com`,
      password: `sidorov`,
      passwordRepeated: `sidorov`,
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataService = new DataService(mockDB);
      app = createAPI(dataService);
    });

    for (const key of Object.keys(validUserData)) {
      const badArticle = {...validUserData};
      delete badArticle[key];

      test(`Posting invalid article without ${key} should return 400`, async () => {
        const response = await request(app).post(`/user`).send(validUserData);
        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      });

      test(`Invalid article without ${key} should not be in data`, async () => {
        await request(app).post(`/user`).send(validUserData);
        const serviceResult = await dataService.findByEmail(validUserData.email);
        expect(serviceResult).toBeNull();
      });
    }
  });

  describe(`Register user with inbalid data`, () => {
    let dataService = null;
    let app = null;

    const validUserData = {
      name: `Сидор`,
      surname: `Сидоров`,
      email: `sidorov@example.com`,
      password: `sidorov`,
      passwordRepeated: `sidorov`,
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataService = new DataService(mockDB);
      app = createAPI(dataService);
    });

    test(`When field type is wrong type response code is 400`, async () => {
      const badUsers = [
        {...validUserData, name: true},
        {...validUserData, surname: false},
        {...validUserData, email: `Котики`}
      ];
      for (const badUser of badUsers) {
        await request(app)
          .post(`/user`)
          .send(badUser)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`When field type is invalid response code is 400`, async () => {
      const badUsers = [
        {...validUserData, title: `Короткий`},
        {...validUserData, announce: `Short`},
        {...validUserData, categories: []}
      ];
      for (const badUser of badUsers) {
        await request(app)
          .post(`/user`)
          .send(badUser)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });
});
