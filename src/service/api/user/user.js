"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);
const schemaValidator = require(`../../middlewares/schema-validator`);
const userSchema = require(`./validators/user-schema`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/user`, route);

  route.post(`/`, [schemaValidator(userSchema)], async (req, res) => {
    try {
      const result = await service.create(req.body);
      return res.status(HttpCode.CREATED).json(result);
    } catch (error) {
      return res.status(HttpCode.BAD_REQUEST).send(error.message);
    }
  });

  route.post(`/auth`, async (req, res) => {
    try {
      const result = await service.auth(req.body);
      return res.status(HttpCode.OK).json(result);
    } catch (error) {
      return res.status(HttpCode.UNAUTHORIZED).send(error.message);
    }
  });
};
