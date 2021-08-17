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

  createComment(articleId, comment) {
    const article = this.findOne(articleId);
    const newComment = {
      id: nanoid(MAX_ID_LENGTH),
      text: comment.text
    };
    article.comments.push(newComment);

    return newComment;
  }

  dropComment(articleId, commentId) {
    const article = this.findOne(articleId);
    let comments = article.comments;
    const deletedComment = comments.find((item) => item.id === commentId);
    comments = comments.filter((item) => item.id !== commentId);
    this.update(articleId, article);

    return deletedComment;
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
