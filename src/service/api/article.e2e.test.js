"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {HttpCode} = require(`../../constants`);
const article = require(`./article`);
const DataService = require(`../data-service/articles`);
const CommentService = require(`../data-service/comment`);
const initDB = require(`../lib/init-db`);

const mockCategories = [
  `За жизнь`,
  `Программирование`,
  `Железо`
];

const mockData = [
  {
    title: `Топ лайфхаки для тебя`,
    announce:
      `Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    fullText:
      `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Согласно официальной версии, принятой в настоящее время, город был основан более 1000 лет назад. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Он написал больше 30 хитов.`,
    categories: [`За жизнь`],
    date: Date.now(),
    comments: [
      {
        text: `Планируете записать видосик на эту тему?`,
      },
    ],
  },
  {
    title: `Рецепт домашней пиццы`,
    announce:
      `Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Согласно официальной версии, принятой в настоящее время, город был основан более 1000 лет назад. Вкуснейшая домашняя пицца на тонком бездрожжевом тесте. Готовится тесто для пиццы без дрожжей очень быстро.`,
    fullText:
      `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вкуснейшая домашняя пицца на тонком бездрожжевом тесте. Готовится тесто для пиццы без дрожжей очень быстро. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    date: Date.now(),
    categories: [
      `Программирование`,
      `Железо`,
    ],
    comments: [
      {
        text: `Это где ж такие красоты? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!`,
      },
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то?`,
      },
      {
        text: `Хочу такую же футболку :-)`,
      },
      {
        text: `Планируете записать видосик на эту тему? Согласен с автором!`,
      },
      {
        text: `Это где ж такие красоты?`,
      },
    ],
  },
  {
    title: `Ёлки. История деревьев`,
    announce:
      `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Он написал больше 30 хитов. У нас есть лайфхак для тех, кто любит отдыхать на свежем воздухе! Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    fullText:
      `Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Ёлки — это не просто красивое дерево. Это прочная древесина. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов. У нас есть лайфхак для тех, кто любит отдыхать на свежем воздухе! Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Первая большая ёлка была установлена только в 1938 году. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Вкуснейшая домашняя пицца на тонком бездрожжевом тесте. Готовится тесто для пиццы без дрожжей очень быстро. Он написал больше 30 хитов.`,
    date: Date.now(),
    categories: [
      `За жизнь`,
    ],
    comments: [
      {
        text: `Совсем немного...`,
      },
      {
        text: `Согласен с автором!`,
      },
    ],
  },
  {
    title: `Учим HTML и CSS`,
    announce:
      `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. У нас есть лайфхак для тех, кто любит отдыхать на свежем воздухе!`,
    fullText:
      `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Собрать камни бесконечности легко, если вы прирожденный герой. У нас есть лайфхак для тех, кто любит отдыхать на свежем воздухе! Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Вкуснейшая домашняя пицца на тонком бездрожжевом тесте. Готовится тесто для пиццы без дрожжей очень быстро.`,
    date: Date.now(),
    categories: [`Программирование`],
    comments: [
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-)`,
      },
      {
        text: `Плюсую, но слишком много буквы!`,
      },
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Планируете записать видосик на эту тему?`,
      },
      {
        text: `Совсем немного... Планируете записать видосик на эту тему? Согласен с автором!`,
      },
    ],
  },
  {
    title: `Учим HTML и CSS`,
    announce:
      `Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText:
      `Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? У нас есть лайфхак для тех, кто любит отдыхать на свежем воздухе! Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Согласно официальной версии, принятой в настоящее время, город был основан более 1000 лет назад. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    date: Date.now(),
    categories: [`За жизнь`],
    comments: [
      {
        text: `Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-)`,
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Планируете записать видосик на эту тему?`,
      },
      {
        text: `Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
    ],
  },
];

const createAPI = (articleService, commentService) => {
  const app = express();
  app.use(express.json());
  article(app, articleService, commentService);
  return app;
};

describe(`POST /articles - Posting new article`, () => {
  describe(`Posting article with valid data`, () => {
    let dataService = null;
    let response = null;

    const newArticle = {
      "title": `Три принципа ООП: "Три кита" Объектно-ориентированного программирования`,
      "announce": `Разберем фундаментальные принципы ООП`,
      "date": Date.now(),
      "fullText": `Объектно-ориентированное программирование основано на «трех китах»`,
      "categories": [1, 2]
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
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
      const serviceResult = await dataService.findOne(response.body.id);
      expect(response.body.title).toEqual(serviceResult.title);
      expect(response.body.announce).toEqual(serviceResult.announce);
      expect(response.body.fullText).toEqual(serviceResult.fullText);
    });
  });

  describe(`Posting article with invalid data`, () => {
    let dataService = null;
    let app = null;

    const newArticle = {
      "title": `Три принципа ООП: "Три кита" Объектно-ориентированного программирования`,
      "announce": `Разберем фундаментальные принципы ООП`,
      "date": Date.now(),
      "categories": [1, 2]
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      app = createAPI(dataService);
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
        const serviceResult = await dataService.findOne(response.body.id);
        expect(serviceResult).toBeNull();
      });
    }
  });
});

describe(`GET /articles - Getting list of all articles`, () => {
  describe(`Getting list if articles exist`, () => {
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
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
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: [], articles: []});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
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
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
      response = await request(app).get(`/articles/1`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns correct article`, async () => {
      const serviceResult = await dataService.findOne(response.body.id);
      expect(response.body.title).toEqual(serviceResult.title);
      expect(response.body.announce).toEqual(serviceResult.announce);
      expect(response.body.fullText).toEqual(serviceResult.fullText);
    });
  });

  describe(`If article with given id does not exist`, () => {
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
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
    let dataService = null;
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
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
      response = await request(app).put(`/articles/1`).send(newArticle);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns changed article`, () => {
      expect(response.body).toBeTruthy();
    });

    test(`Article in data is changed`, async () => {
      const serviceResult = await dataService.findOne(1);
      expect(serviceResult.title).toEqual(newArticle.title);
      expect(serviceResult.announce).toEqual(newArticle.announce);
      expect(serviceResult.fullText).toEqual(newArticle.fullText);
    });
  });

  describe(`Changing article with invalid data`, () => {
    let dataService = null;
    let response = null;

    const newArticle = {
      title: `Это`,
      announce: `Не валидный объект`,
      fullText: `Нет поля categories`,
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
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
    let dataService = null;
    let response = null;

    const newArticle = {
      title: `Три принципа ООП: "Три кита" Объектно-ориентированного программирования`,
      announce: `Разберем фундаментальные принципы ООП`,
      fullText: `Объектно-ориентированное программирование основано на «трех китах»`,
      categories: [3]
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
      response = await request(app).put(`/articles/999999`).send(newArticle);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`Changing article with invalid id`, () => {
    let dataService = null;
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
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
      response = await request(app).put(`/articles/INVALID`).send(newArticle);
    });

    test(`Status code should be 400`, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`DELETE /articles/:id - Deleting an article`, () => {
  describe(`Deleting existent article`, () => {
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
      response = await request(app).delete(`/articles/1`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Deleted article removes from data`, async () => {
      const serviceResult = await dataService.findOne(1);
      expect(serviceResult).toEqual(null);
    });

    test(`Returns correct answer`, () => {
      expect(response.body).toBeTruthy();
    });
  });

  describe(`Deleting non-existent article`, () => {
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
      response = await request(app).delete(`/articles/NONEXIST`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`GET /articles/:id/comments - Getting article comments`, () => {
  describe(`Getting comments of exist article`, () => {
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
      response = await request(app).get(`/articles/1/comments`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns correct comments`, async () => {
      const serviceResult = await dataService.findOne(1, true);
      expect(response.body[0].text).toEqual(serviceResult.comments[0].text);
    });
  });

  describe(`Getting comments of non-exist offer`, () => {
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService);
      response = await request(app).get(`/articles/NONEXIST/comments`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`POST /articles/:id/comments - Posting article comment`, () => {
  describe(`Posting comment with valid data`, () => {
    let dataService = null;
    let response = null;

    const newComment = {
      text: `Полностью согласен!`,
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService, new CommentService(mockDB));
      response = await request(app).post(`/articles/1/comments`).send(newComment);
    });

    test(`Status code should be 201 `, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    test(`API returns correct answer`, () => {
      expect(response.body).toBeTruthy();
    });

    test(`Comment created in data service`, async () => {
      const serviceResult = await dataService.findOne(1, true);
      expect(serviceResult.comments[1].text).toEqual(newComment.text);
    });
  });

  describe(`Posting comment with invalid data`, () => {
    let dataService = null;
    let response = null;

    const invalidComment = {
      invalidKey: `Невалидный комментарий`,
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService, new CommentService(mockDB));
      response = await request(app).post(`/articles/1/comments`).send(invalidComment);
    });

    test(`Status code should be 400 `, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Comment isn't created in data service`, async () => {
      const serviceResult = await dataService.findOne(1, true);
      expect(serviceResult.comments.length).toBe(1);
    });
  });

  describe(`Posting comment to non-exist offer`, () => {
    let dataService = null;
    let response = null;

    const newComment = {
      text: `Полностью согласен!`,
    };

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService, new CommentService(mockDB));
      response = await request(app).post(`/articles/9999/comments`).send(newComment);
    });

    test(`Status code should be 404 `, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`DELETE /articles/:id/comments/:id - Deleting an article comment`, () => {
  describe(`Deleting existent comment`, () => {
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService, new CommentService(mockDB));
      response = await request(app).delete(`/articles/1/comments/1`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Deleted comment removes from data`, async () => {
      const serviceResult = await dataService.findOne(1, true);
      expect(serviceResult.comments.length).toBe(0);
    });

    test(`Returns correct answer`, () => {
      expect(response.body).toBeTruthy();
    });
  });

  describe(`Deleting non-existent comment`, () => {
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
      await initDB(mockDB, {categories: mockCategories, articles: mockData});
      dataService = new DataService(mockDB);
      const app = createAPI(dataService, new CommentService(mockDB));
      response = await request(app).delete(`/articles/1/comments/NONEXIST`);
    });


    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});
