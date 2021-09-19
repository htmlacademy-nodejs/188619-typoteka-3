"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {HttpCode} = require(`../../../constants`);
const user = require(`./user`);
const DataRepository = require(`../../data-repository/user`);
const initDB = require(`../../lib/init-db`);
const {mockCategories, mockData, mockUsers} = require(`../../../mocks`);

const createAPI = (service) => {
  const app = express();
  app.use(express.json());
  user(app, service);
  return app;
};

describe(`POST /user - Register new user`, () => {
  describe(`Register user with valid data`, () => {
    let dataRepository = null;
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
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).post(`/user`).send(validUserData);
    });

    test(`Status code should be 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    test(`User created`, async () => {
      const result = await dataRepository.findByEmail(validUserData.email);
      expect(result.email).toEqual(validUserData.email);
      expect(result.name).toEqual(validUserData.name);
      expect(result.surname).toEqual(validUserData.surname);
    });
  });

  describe(`Register user without some keys`, () => {
    let dataRepository = null;
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
      dataRepository = new DataRepository(mockDB);
      app = createAPI(dataRepository);
    });

    for (const key of Object.keys(validUserData)) {
      const badUser = {...validUserData};
      delete badUser[key];

      test(`Register invalid user without ${key} should return 400`, async () => {
        const response = await request(app).post(`/user`).send(badUser);
        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      });

      test(`Register user without ${key} should not be in data`, async () => {
        await request(app).post(`/user`).send(badUser);
        const serviceResult = await dataRepository.findByEmail(validUserData.email);
        expect(serviceResult).toBeNull();
      });
    }
  });

  describe(`Register user with invalid data`, () => {
    let dataRepository = null;
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
      dataRepository = new DataRepository(mockDB);
      app = createAPI(dataRepository);
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

  describe(`Register user with used email`, () => {
    let dataRepository = null;
    let response = null;

    const validUserData = {
      name: `Сидор`,
      surname: `Сидоров`,
      email: `ivanov@example.com`,
      password: `sidorov`,
      passwordRepeated: `sidorov`,
      avatar: `sidorov.jpg`
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).post(`/user`).send(validUserData);
    });

    test(`Status code should be 400`, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`User not created`, async () => {
      const result = await dataRepository.findByEmail(validUserData.email);
      expect(result.email).toEqual(validUserData.email);
      expect(result.name).toEqual(`Иван`);
    });
  });
});

describe(`POST /auth - User auth`, () => {
  describe(`API authenticate user if data is valid`, () => {
    let dataRepository = null;
    let response = null;

    const validAuthData = {
      email: `ivanov@example.com`,
      password: `ivanov`
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).post(`/user/auth`).send(validAuthData);
    });

    test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`User name is Иван`, () => expect(response.body.name).toBe(`Иван`));
  });

  describe(`API refuses to authenticate user if data is invalid`, () => {
    let dataRepository = null;
    let response = null;

    const invalidAuthData = {
      email: `not-exist@example.com`,
      password: `petrov`
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).post(`/user/auth`).send(invalidAuthData);
    });

    test(`Status code is 401`, () => expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED));
  });

  describe(`API refuses to authenticate user if password is invalid`, () => {
    let dataRepository = null;
    let response = null;

    const invalidAuthData = {
      email: `petrovt@example.com`,
      password: `ivanov`
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).post(`/user/auth`).send(invalidAuthData);
    });

    test(`Status code is 401`, () => expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED));
  });
});
