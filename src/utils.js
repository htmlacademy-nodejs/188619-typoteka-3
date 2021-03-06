'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const sendRequestedPath = (req, res, next) => {
  res.send(req.baseUrl + req.path);
  next();
};

const ensureArray = (value) => Array.isArray(value) ? value : [value];

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};

module.exports = {
  getRandomInt,
  getRandomDate,
  shuffle,
  prepareErrors,
  sendRequestedPath,
  ensureArray,
  getRandomSubarray
};
