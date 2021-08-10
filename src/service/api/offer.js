'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const offerExist = require(`../middlewares/offer-exist`);
const commentExist = require(`../middlewares/comment-exist`);
const commentValidator = require(`../middlewares/comment-validator`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = service.findAll();

    return res.status(HttpCode.OK)
      .json(offers);
  });

  route.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = service.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = service.create(req.body);

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.put(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = service.update(offerId, req.body);

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.delete(`/:offerId`, offerExist(service), (req, res) => {
    const {offerId} = req.params;
    const offer = service.drop(offerId);

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.get(`/:offerId/comments`, offerExist(service), (req, res) => {
    const {offer} = res.locals;
    return res.status(HttpCode.OK)
      .json(offer.comments);
  });

  route.post(`/:offerId/comments`, [offerExist(service), commentValidator], (req, res) => {
    const {offerId} = req.params;
    const comment = service.createComment(offerId, req.body);
    return res.status(HttpCode.OK)
      .json(comment);
  });

  route.delete(`/:offerId/comments/:commentId`, [offerExist(service), commentExist()], (req, res) => {
    const {offerId, commentId} = req.params;
    const comment = service.dropComment(offerId, commentId);

    return res.status(HttpCode.OK)
      .json(comment);
  });
};
