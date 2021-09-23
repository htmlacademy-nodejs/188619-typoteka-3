"use strict";

const SearchRepository = require(`./search.repository`);

class SearchService {
  constructor(sequelize) {
    this.repository = new SearchRepository(sequelize);
  }

  findAll(query) {
    return this.repository.findAll(query);
  }
}

module.exports = SearchService;
