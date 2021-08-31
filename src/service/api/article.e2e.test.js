"use strict";

const express = require(`express`);
const request = require(`supertest`);
const {HttpCode} = require(`../../constants`);
const article = require(`./article`);
const DataService = require(`../data-service/articles`);

const mockData = [
  {
    id: `Y0jarS`,
    title: `Топ лайфхаки для тебя`,
    createdDate: `2021-08-07 13:20:04`,
    announce:
      `Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    fullText:
      `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Согласно официальной версии, принятой в настоящее время, город был основан более 1000 лет назад. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Он написал больше 30 хитов.`,
    category: [`За жизнь`],
    comments: [
      {
        id: `i6tgtj`,
        text: `Планируете записать видосик на эту тему?`,
      },
    ],
  },
  {
    id: `oW0bwY`,
    title: `Рецепт домашней пиццы`,
    createdDate: `2021-06-25 20:26:46`,
    announce:
      `Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Согласно официальной версии, принятой в настоящее время, город был основан более 1000 лет назад. Вкуснейшая домашняя пицца на тонком бездрожжевом тесте. Готовится тесто для пиццы без дрожжей очень быстро.`,
    fullText:
      `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вкуснейшая домашняя пицца на тонком бездрожжевом тесте. Готовится тесто для пиццы без дрожжей очень быстро. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    category: [
      `Разное`,
      `Программирование`,
      `Кино`,
      `За жизнь`,
      `Деревья`,
      `Железо`,
      `IT`,
      `Музыка`,
    ],
    comments: [
      {
        id: `fhuPdr`,
        text: `Это где ж такие красоты? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!`,
      },
      {
        id: `BKp7Og`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то?`,
      },
      {
        id: `NXWhw6`,
        text: `Хочу такую же футболку :-)`,
      },
      {
        id: `J9PxYz`,
        text: `Планируете записать видосик на эту тему? Согласен с автором!`,
      },
      {
        id: `7vSA0c`,
        text: `Это где ж такие красоты?`,
      },
    ],
  },
  {
    id: `ZHTrt8`,
    title: `Ёлки. История деревьев`,
    createdDate: `2021-06-29 11:55:38`,
    announce:
      `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Он написал больше 30 хитов. У нас есть лайфхак для тех, кто любит отдыхать на свежем воздухе! Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    fullText:
      `Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Ёлки — это не просто красивое дерево. Это прочная древесина. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов. У нас есть лайфхак для тех, кто любит отдыхать на свежем воздухе! Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Первая большая ёлка была установлена только в 1938 году. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Вкуснейшая домашняя пицца на тонком бездрожжевом тесте. Готовится тесто для пиццы без дрожжей очень быстро. Он написал больше 30 хитов.`,
    category: [
      `За жизнь`,
      `Музыка`,
      `Разное`,
      `IT`,
      `Без рамки`,
      `Программирование`,
      `Деревья`,
      `Кино`,
    ],
    comments: [
      {
        id: `lBqx_I`,
        text: `Совсем немного...`,
      },
      {
        id: `KhxeXc`,
        text: `Согласен с автором!`,
      },
    ],
  },
  {
    id: `0jy5Lx`,
    title: `Учим HTML и CSS`,
    createdDate: `2021-06-06 02:09:06`,
    announce:
      `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. У нас есть лайфхак для тех, кто любит отдыхать на свежем воздухе!`,
    fullText:
      `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Собрать камни бесконечности легко, если вы прирожденный герой. У нас есть лайфхак для тех, кто любит отдыхать на свежем воздухе! Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Вкуснейшая домашняя пицца на тонком бездрожжевом тесте. Готовится тесто для пиццы без дрожжей очень быстро.`,
    category: [`Музыка`, `Без рамки`, `Программирование`],
    comments: [
      {
        id: `QRhBHL`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-)`,
      },
      {
        id: `-n9y4b`,
        text: `Плюсую, но слишком много буквы!`,
      },
      {
        id: `rF2y82`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Планируете записать видосик на эту тему?`,
      },
      {
        id: `iqnLgO`,
        text: `Совсем немного... Планируете записать видосик на эту тему? Согласен с автором!`,
      },
    ],
  },
  {
    id: `KplZAt`,
    title: `Учим HTML и CSS`,
    createdDate: `2021-07-20 21:29:44`,
    announce:
      `Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText:
      `Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? У нас есть лайфхак для тех, кто любит отдыхать на свежем воздухе! Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Согласно официальной версии, принятой в настоящее время, город был основан более 1000 лет назад. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    category: [`IT`, `За жизнь`],
    comments: [
      {
        id: `bMih9n`,
        text: `Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-)`,
      },
      {
        id: `eOocJs`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Планируете записать видосик на эту тему?`,
      },
      {
        id: `grYivH`,
        text: `Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
    ],
  },
];

const createAPI = (service) => {
  const app = express();
  app.use(express.json());
  article(app, service);
  return app;
};

describe(`Posting new article`, () => {
  describe(`Posting article with valid data`, () => {
    let app = null;
    let dataService = null;
    let response = null;

    const newArticle = {
      title: `Три принципа ООП`,
      announce: `Разберем фундаментальные принципы ООП`,
      fullText: `Объектно-ориентированное программирование основано на «трех китах»`,
      category: `IT`
    };
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).post(`/articles`).send(newArticle);
    });

    test(`Status code should be 201 `, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    test(`API returns created offer`, () => {
      expect(response.body).toEqual(expect.objectContaining(newArticle));
    });

    test(`Article created in data service`, () => {
      expect(dataService.findOne(response.body.id)).toMatchObject(newArticle);
    });
  });

  describe(`Posting article with invalid data`, () => {
    let app = null;
    let dataService = null;

    const newArticle = {
      title: `Три принципа ООП`,
      announce: `Разберем фундаментальные принципы ООП`,
      fullText: `Объектно-ориентированное программирование основано на «трех китах»`,
      category: `IT`
    };
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
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
        await request(app).post(`/articles`).send(badArticle);
        expect(dataService.findAll()).not.toContain(badArticle);
      });

      test(`Offers count should not increase`, async () => {
        await request(app).post(`/articles`).send(badArticle);
        expect(dataService.findAll().length).toBe(5);
      });
    }
  });
});

describe(`Getting list of all articles`, () => {
  describe(`Getting list if articles exist`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).get(`/articles`);
    });

    test(`Status code should be 200 `, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Response body length should be equal to data articles length`, () => {
      expect(response.body.length).toBe(cloneData.length);
    });

    test(`First offer id is equal to ${cloneData[0].id}`, () => {
      expect(response.body[0].id).toBe(cloneData[0].id);
    });
  });

  describe(`Getting list if offers doesn't exist`, () => {
    let app = null;
    let dataService = null;
    let response = null;

    beforeAll(async () => {
      dataService = new DataService([]);
      app = createAPI(dataService);
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

describe(`Getting article with given id`, () => {
  describe(`If article with given id exists`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).get(`/articles/Y0jarS`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns correct article`, () => {
      expect(response.body).toEqual(dataService.findOne(`Y0jarS`));
    });
  });

  describe(`If article with given id does not exist`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).get(`/offers/NOTEXIST`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`Does not return any article`, () => {
      expect(dataService.findAll()).not.toContain(response.body);
    });
  });
});

describe(`Changing an article`, () => {
  describe(`Changing existent article with valid data`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));
    const newArticle = {
      title: `Три принципа ООП`,
      announce: `Разберем фундаментальные принципы ООП`,
      fullText: `Объектно-ориентированное программирование основано на «трех китах»`,
      category: `IT`
    };

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).put(`/articles/Y0jarS`).send(newArticle);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns changed article`, () => {
      expect(response.body).toEqual(expect.objectContaining(newArticle));
    });

    test(`Article in data is changed`, () => {
      expect(dataService.findOne(`Y0jarS`)).toEqual(
          expect.objectContaining(newArticle)
      );
    });
  });

  describe(`Changing article with invalid data`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));
    const invalidArticle = {
      title: `Это`,
      announce: `невалидный`,
      fullText: `объект - нет поля sum`,
    };

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).put(`/articles/Y0jarS`).send(invalidArticle);
    });

    test(`Status code should be 400`, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Does not return changed article`, () => {
      expect(response.body).not.toEqual(expect.objectContaining(invalidArticle));
    });

    test(`Article in data didn't change`, () => {
      expect(dataService.findOne(`Y0jarS`)).not.toEqual(
          expect.objectContaining(invalidArticle)
      );
    });
  });

  describe(`Changing not existent article`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));
    const newArticle = {
      title: `Три принципа ООП`,
      announce: `Разберем фундаментальные принципы ООП`,
      fullText: `Объектно-ориентированное программирование основано на «трех китах»`,
      category: `IT`
    };

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).put(`/articles/NOT_EXIST`).send(newArticle);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Deleting an article`, () => {
  describe(`Deleting existent article`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).delete(`/articles/Y0jarS`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Deleted article removes from data`, () => {
      expect(dataService.findAll()).not.toContain(response.body);
    });

    test(`Returns correct article`, () => {
      expect(response.body.id).toEqual(`Y0jarS`);
    });
  });

  describe(`Deleting non-existent article`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).delete(`/articles/NOT_EXIST`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Getting article comments`, () => {
  describe(`Getting comments of exist article`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).get(`/articles/Y0jarS/comments`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns all comments`, () => {
      expect(response.body).toEqual(dataService.findOne(`Y0jarS`).comments);
    });
  });

  describe(`Getting comments of non-exist offer`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).get(`/articles/NON_EXIST/comments`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Posting article comment`, () => {
  describe(`Posting comment with valid data`, () => {
    let app = null;
    let dataService = null;
    let response = null;

    const newComment = {
      text: `Полностью согласен!`,
    };
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app)
        .post(`/articles/Y0jarS/comments`)
        .send(newComment);
    });

    test(`Status code should be 201 `, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    test(`API returns created comment`, () => {
      expect(response.body).toEqual(expect.objectContaining(newComment));
    });

    test(`Comment created in data service`, () => {
      expect(dataService.findOne(`Y0jarS`).comments).toEqual(
          expect.arrayContaining([expect.objectContaining(newComment)])
      );
    });
  });

  describe(`Posting comment with invalid data`, () => {
    let app = null;
    let dataService = null;
    let response = null;

    const invalidComment = {
      invalidKey: `Невалидный комментарий`,
    };
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app)
        .post(`/articles/Y0jarS/comments`)
        .send(invalidComment);
    });

    test(`Status code should be 400 `, () => {
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Comment isn't created in data service`, () => {
      expect(dataService.findOne(`Y0jarS`).comments).not.toEqual(
          expect.arrayContaining([expect.objectContaining(invalidComment)])
      );
    });
  });

  describe(`Posting comment to non-exist offer`, () => {
    let app = null;
    let dataService = null;
    let response = null;

    const newComment = {
      text: `Полностью согласен!`,
    };
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app)
        .post(`/articles/NOT_EXIST/comments`)
        .send(newComment);
    });

    test(`Status code should be 404 `, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});

describe(`Deleting an article comment`, () => {
  describe(`Deleting existent comment`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).delete(`/articles/Y0jarS/comments/i6tgtj`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Deleted comment removes from data`, () => {
      expect(dataService.findOne(`Y0jarS`).comments).not.toEqual(
          expect.arrayContaining([expect.objectContaining({id: `i6tgtj`})])
      );
    });

    test(`Returns correct offer`, () => {
      expect(response.body.id).toEqual(`i6tgtj`);
    });
  });

  describe(`Deleting non-existent comment`, () => {
    let app = null;
    let dataService = null;
    let response = null;
    const cloneData = JSON.parse(JSON.stringify(mockData));

    beforeAll(async () => {
      dataService = new DataService(cloneData);
      app = createAPI(dataService);
      response = await request(app).delete(`/articles/Y0jarS/comments/NOT_EXIST`);
    });

    test(`Status code should be 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});
