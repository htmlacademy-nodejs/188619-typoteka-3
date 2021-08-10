'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class articleservice {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const [date, time] = new Date().toISOString().slice(0, -5).split(`T`);

    const newArticle = Object
      .assign({
        id: nanoid(MAX_ID_LENGTH),
        createdDate: `${date} ${time}`,
        comments: []
      }, article);

    this._articles.push(newArticle);
    return newArticle;
  }

  drop(id) {
    const article = this._articles.find((item) => item.id === id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);
    return article;
  }

  createComment(offerId, comment) {
    const article = this.findOne(offerId);
    article.comments.push({
      id: nanoid(MAX_ID_LENGTH),
      text: comment.text
    });

    return article.comments;
  }

  dropComment(offerId, commentId) {
    const article = this.findOne(offerId);
    let comments = article.comments;
    comments = comments.filter((item) => item.id !== commentId);
    this.update(offerId, article);

    return comments;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  update(id, article) {
    const oldArticle = this._articles
      .find((item) => item.id === id);

    return Object.assign(oldArticle, article);
  }

}

module.exports = articleservice;
