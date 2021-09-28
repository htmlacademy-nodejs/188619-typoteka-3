'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (req, res) => {
  res.status(HttpCode.NOT_FOUND).redirect(`/404`);
};
