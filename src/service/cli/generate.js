'use strict';

const fs = require(`fs`);
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);
const {
  getRandomInt,
  getRandomDate,
  shuffle,
} = require(`../../utils`);

const Publications = {
  DEFAULT_COUNT: 1,
  MAX_COUNT: 1000,
};

const FILE_NAME = `mocks.json`;
const MAX_MONTHS_AGO = 3;
const MAX_ANNOUNCE_SENTENCES = 5;
const MAX_TEXT_SENTENCES = 15;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const getTitle = () => TITLES[getRandomInt(0, TITLES.length - 1)];

const getCreatedDate = () => {
  const endDate = new Date();
  const startDate = new Date(new Date().setMonth(endDate.getMonth() - MAX_MONTHS_AGO));
  const dateISO = getRandomDate(startDate, endDate).toISOString();
  const [date, time] = dateISO.slice(0, -5).split(`T`);
  return date + ` ` + time;
};

const getAnnounce = () => shuffle(SENTENCES).slice(0, MAX_ANNOUNCE_SENTENCES).join(` `);

const getFullText = () => shuffle(SENTENCES).slice(0, MAX_TEXT_SENTENCES).join(` `);

const getCategory = () => shuffle(CATEGORIES).slice(0, getRandomInt(1, CATEGORIES.length - 1));

const generatePublications = (count) => (
  Array(count).fill({}).map(() => ({
    title: getTitle(),
    createdDate: getCreatedDate(),
    announce: getAnnounce(),
    fullText: getFullText(),
    сategory: getCategory(),
  }))
);

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;

    if (count > Publications.MAX_COUNT) {
      console.error(chalk.red(`Не больше ${Publications.MAX_COUNT} публикаций.`));
      process.exit(ExitCode.error);
    }

    const publicationsCount = Number.parseInt(count, 10) || Publications.DEFAULT_COUNT;
    const content = JSON.stringify(generatePublications(publicationsCount));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        console.error(chalk.red(`Не удалось записать данные в файл...`));
        process.exit(ExitCode.error);
      }

      console.info(chalk.green(`Операция выполнена. Файл создан.`));
      process.exit(ExitCode.success);
    });
  }
};
