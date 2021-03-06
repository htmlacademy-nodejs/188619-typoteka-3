'use strict';

const path = require(`path`);
const express = require(`express`);
const pageNotFound = require(`./middlewares/page-not-found`);
const internalError = require(`./middlewares/internal-error`);
const sessionStore = require(`../service/lib/sessions`);
const mainRoutes = require(`./routes/main-routes`);
const articlesRoutes = require(`./routes/article-routes`);
const categoryRouter = require(`./routes/category-routes`);
const myRoutes = require(`./routes/my-routes`);

const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const DEFAULT_PORT = 8080;

const app = express();
app.use(express.urlencoded({extended: false}));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(sessionStore);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(`/`, mainRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/categories`, categoryRouter);
app.use(`/my`, myRoutes);
app.use(pageNotFound);
app.use(internalError);


app.listen(DEFAULT_PORT);
