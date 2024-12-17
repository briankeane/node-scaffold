const Sequelize = require('sequelize');
const logger = require('../logger');
const dbConfig = require('./config')[process.env.NODE_ENV];
const sequelize = new Sequelize(dbConfig.url, {
  ...dbConfig,
  logger,
});

const User = require('./models/user.model');
const SpotifyUser = require('./models/spotifyUser.model');

/*
 * Relationships
 */

const models = {
  User,
  SpotifyUser,
};

module.exports = { sequelize, db: sequelize, models };
