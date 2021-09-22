'use strict';

const session = require(`express-session`);
const sequelize = require(`./sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const {SESSION_SECRET} = process.env;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

module.exports = session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
});
