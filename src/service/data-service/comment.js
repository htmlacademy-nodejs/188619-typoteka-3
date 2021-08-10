'use strict';

class CommentService {
  constructor(offers) {
    this._offers = offers;
  }


  findAll() {
    const comments = this._offers.reduce((acc, offer) => {
      offer.comments.forEach((comment) => acc.add(comment));
      return acc;
    }, new Set());

    return [...comments];
  }
}

module.exports = CommentService;
