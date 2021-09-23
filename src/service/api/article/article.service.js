"use strict";

const SearchRepository = require(`./search.repository`);

class SearchService {
  constructor(sequelize) {
    this.repository = new SearchRepository(sequelize);
  }

}

module.exports = SearchService;
