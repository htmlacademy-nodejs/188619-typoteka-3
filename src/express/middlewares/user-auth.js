'use strict';

const api = require(`../api`).getAPI();
const {prepareErrors} = require(`../../utils`);

const {ADMIN_ID} = process.env;

if (!ADMIN_ID) {
  throw new Error(`ADMIN_ID environment variable is not defined`);
}

module.exports = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await api.auth(email, password);
    req.session.user = user;
    req.session.user.isAdmin = +user.id === +ADMIN_ID;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render(`auth/login`, {user, validationMessages});
  }
};
