"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  announce: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  picture: DataTypes.STRING,
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fullText: {
    type: DataTypes.TEXT
  },
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
