/* eslint new-cap: 0 */
const bunyan = require('bunyan');

const {
  LOG_LEVEL,
} = process.env;

const getLogger = (filename) => new bunyan.createLogger({ name: filename, level: LOG_LEVEL || 'info' });

module.exports = getLogger;