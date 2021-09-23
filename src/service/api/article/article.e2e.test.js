"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {HttpCode} = require(`../../../constants`);
const article = require(`./article`);
const DataRepository = require(`./articles.repository`);
const CommentRepository = require(`../comment/comment.repository`);
const initDB = require(`../../lib/init-db`);
const {mockCategories, mockData, mockUsers} = require(`../../../mocks`);


const createAPI = (articleRepository, commentRepository) => {
  const app = express();
  app.use(express.json());
  article(app, articleRepository, commentRepository);
  return app;
};

describe(`POST /articles - Posting new article`, () => {
  describe(`Posting article with valid data`, () => {
    let dataRepository = null;
    let response = null;

    const newArticle = {
      "title": `Три принципа ООП: "Три кита" Объектно-ориентированного программирования`,
      "announce": `Разберем фундаментальные принципы ООП`,
      "date": Date.now(),
      "fullText": `Объектно-ориентированное программирование основано на «трех китах»`,
      "categories": [1, 2],
      "userId": 1
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).post(`/articles`).send(newArticle);
    });

    test(`Status code should be 201 `, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    test(`API returns created offer`, () => {
      expect(response.body.title).toEqual(newArticle.title);
      expect(response.body.announce).toEqual(newArticle.announce);
      expect(response.body.fullText).toEqual(newArticle.fullText);
    });

    test(`Article created in data service`, async () => {
      const serviceResult = await dataRepository.findOne(response.body.id);
      expect(response.body.title).toEqual(serviceResult.title);
      expect(response.body.announce).toEqual(serviceResult.announce);
      expect(response.body.fullText).toEqual(serviceResult.fullText);
    });
  });

  describe(`Posting article without some keys`, () => {
    let dataRepository = null;
    let app = null;

    const newArticle = {
      "title": `Три принципа ООП: "Три кита" Объектно-ориентированного программирования`,
      "announce": `Разберем фундаментальные принципы ООП`,
      "date": Date.now(),
      "categories": [1, 2]
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      app = createAPI(dataRepository);
    });

    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];

      test(`Posting invalid article without ${key} should return 400`, async () => {
        const response = await request(app).post(`/articles`).send(badArticle);
        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      });

      test(`Invalid article without ${key} should not be in data`, async () => {
        const response = await request(app).post(`/articles`).send(badArticle);
        const serviceResult = await dataRepository.findOne(response.body.id);
        expect(serviceResult).toBeNull();
      });
    }
  });

  describe(`Posting article with invalid data`, () => {
    let dataRepository = null;
    let app = null;

    const newArticle = {
      "title": `Три принципа ООП: "Три кита" Объектно-ориентированного программирования`,
      "announce": `Разберем фундаментальные принципы ООП`,
      "date": Date.now(),
      "categories": [1, 2]
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      app = createAPI(dataRepository);
    });

    test(`When field type is wrong type response code is 400`, async () => {
      const badArticles = [
        {...newArticle, title: true},
        {...newArticle, date: false},
        {...newArticle, categories: `Котики`}
      ];
      for (const badArticle of badArticles) {
        await request(app)
          .post(`/articles`)
          .send(badArticle)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`When field type is invalid response code is 400`, async () => {
      const badArticles = [
        {...newArticle, title: `Короткий`},
        {...newArticle, announce: `Short`},
        {...newArticle, categories: []}
      ];
      for (const badArticle of badArticles) {
        await request(app)
          .post(`/articles`)
          .send(badArticle)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });
});

describe(`GET /articles - Getting list of all articles`, () => {
  describe(`Getting list if articles exist`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/articles`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body length should be equal to data articles length`, () => {
      expect(response.body.length).toBe(mockData.length);
    });

    test(`First offer title is equal to ${mockData[0].title}`, () => {
      expect(response.body[0].title).toBe(mockData[0].title);
    });
  });

  describe(`Getting list if offers doesn't exist`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: [], articles: [], users: []});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/articles`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body length should be equal to 0`, () => {
      expect(response.body.length).toBe(0);
    });
  });
});

describe(`GET /articles/:id - Getting article with given id`, () => {
  describe(`If article with given id exists`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/articles/1`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns correct article`, async () => {
      const serviceResult = await dataRepository.findOne(response.body.id);
      expect(response.body.title).toEqual(serviceResult.title);
      expect(response.body.announce).toEqual(serviceResult.announce);
      expect(response.body.fullText).toEqual(serviceResult.fullText);
    });
  });

  describe(`If article with given id does not exist`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/articles/NONEXIST`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`Does not return any article`, () => {
      expect(response.body).toEqual({});
    });
  });
});

describe(`PUT /articles/:id - Changing an article`, () => {
  describe(`Changing existent article with valid data`, () => {
    let dataRepository = null;
    let response = null;

    const newArticle = {
      title: `Три принципа ООП: "Три кита" Объектно-ориентированного программирования`,
      announce: `Разберем фундаментальные принципы ООП`,
      date: Date.now(),
      fullText: `Объектно-ориентированное программирование основано на «трех китах»`,
      categories: [3],
      userId: 1
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).put(`/articles/1`).send(newArticle);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns changed article`, () => {
      expect(response.body).toBeTruthy();
    });

    test(`Article in data is changed`, async () => {
      const serviceResult = await dataRepository.findOne(1);
      expect(serviceResult.title).toEqual(newArticle.title);
      expect(serviceResult.announce).toEqual(newArticle.announce);
      expect(serviceResult.fullText).toEqual(newArticle.fullText);
    });
  });

  describe(`Changing article with invalid data`, () => {
    let dataRepository = null;
    let response = null;

    const newArticle = {
      title: `Это`,
      announce: `Не валидный объект`,
      fullText: `Нет поля categories`,
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).put(`/articles/1`).send(newArticle);
    });

    test(`Status code should be 400`, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Does not return changed article`, () => {
      expect(response.body).toEqual({});
    });
  });

  describe(`Changing not existent article`, () => {
    let dataRepository = null;
    let response = null;

    const newArticle = {
      title: `Три принципа ООП: "Три кита" Объектно-ориентированного программирования`,
      announce: `Разберем фундаментальные принципы ООП`,
      fullText: `Объектно-ориентированное программирование основано на «трех китах»`,
      categories: [3]
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).put(`/articles/999999`).send(newArticle);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`Changing article with invalid id`, () => {
    let dataRepository = null;
    let response = null;

    const newArticle = {
      title: `Три принципа ООП: "Три кита" Объектно-ориентированного программирования`,
      announce: `Разберем фундаментальные принципы ООП`,
      date: Date.now(),
      fullText: `Объектно-ориентированное программирование основано на «трех китах»`,
      categories: [3]
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).put(`/articles/INVALID`).send(newArticle);
    });

    test(`Status code should be 400`, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`DELETE /articles/:id - Deleting an article`, () => {
  describe(`Deleting existent article`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).delete(`/articles/1`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Deleted article removes from data`, async () => {
      const serviceResult = await dataRepository.findOne(1);
      expect(serviceResult).toEqual(null);
    });

    test(`Returns correct answer`, () => {
      expect(response.body).toBeTruthy();
    });
  });

  describe(`Deleting non-existent article`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).delete(`/articles/NONEXIST`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`GET /articles/:id/comments - Getting article comments`, () => {
  describe(`Getting comments of exist article`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/articles/1/comments`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns correct comments`, async () => {
      const serviceResult = await dataRepository.findOne(1, true);
      expect(response.body[0].text).toEqual(serviceResult.comments[0].text);
    });
  });

  describe(`Getting comments of non-exist offer`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository);
      response = await request(app).get(`/articles/NONEXIST/comments`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`POST /articles/:id/comments - Posting article comment`, () => {
  describe(`Posting comment with valid data`, () => {
    let dataRepository = null;
    let response = null;

    const newComment = {
      text: `Полностью согласен!`,
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository, new CommentRepository(mockDB));
      response = await request(app).post(`/articles/1/comments`).send(newComment);
    });

    test(`Status code should be 201 `, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    test(`API returns correct answer`, () => {
      expect(response.body).toBeTruthy();
    });

    test(`Comment created in data service`, async () => {
      const serviceResult = await dataRepository.findOne(1, true);
      expect(serviceResult.comments[1].text).toEqual(newComment.text);
    });
  });

  describe(`Posting comment with invalid data`, () => {
    let dataRepository = null;
    let response = null;

    const invalidComment = {
      invalidKey: `Невалидный комментарий`,
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository, new CommentRepository(mockDB));
      response = await request(app).post(`/articles/1/comments`).send(invalidComment);
    });

    test(`Status code should be 400 `, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Comment isn't created in data service`, async () => {
      const serviceResult = await dataRepository.findOne(1, true);
      expect(serviceResult.comments.length).toBe(1);
    });
  });

  describe(`Posting comment to non-exist offer`, () => {
    let dataRepository = null;
    let response = null;

    const newComment = {
      text: `Полностью согласен!`,
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository, new CommentRepository(mockDB));
      response = await request(app).post(`/articles/9999/comments`).send(newComment);
    });

    test(`Status code should be 404 `, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`DELETE /articles/:id/comments/:id - Deleting an article comment`, () => {
  describe(`Deleting existent comment`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository, new CommentRepository(mockDB));
      response = await request(app).delete(`/articles/1/comments/1`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Deleted comment removes from data`, async () => {
      const serviceResult = await dataRepository.findOne(1, true);
      expect(serviceResult.comments.length).toBe(0);
    });

    test(`Returns correct answer`, () => {
      expect(response.body).toBeTruthy();
    });
  });

  describe(`Deleting non-existent comment`, () => {
    let dataRepository = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
      dataRepository = new DataRepository(mockDB);
      const app = createAPI(dataRepository, new CommentRepository(mockDB));
      response = await request(app).delete(`/articles/1/comments/NONEXIST`);
    });


    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});
