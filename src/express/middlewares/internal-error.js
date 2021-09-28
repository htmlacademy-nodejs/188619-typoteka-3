'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (error, _req, _res, _next) => {
  _res.status(HttpCode.INTERNAL_SERVER_ERROR).redirect(`/500`);
};
