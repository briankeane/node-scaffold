const eventStream = require('./lib/events');
const eventHandlers = require('./lib/events/handlers');
const logger = require('./logger');
const cron = require('node-cron');
const db = require('./db');
const { Op } = require('sequelize');

eventStream.connectWithRetry().then(() => {
  logger.log('Subsscribing');
  eventHandlers.subscribe();
  logger.log('Worker Started');
});

cron.schedule('*/15 * * * *', async () => {});

// Erase everything before midnight this morning
cron.schedule('0 0 20 * * *', async () => {});

// run once when it starts
// updateAllPlaylists();
