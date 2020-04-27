/* eslint no-param-reassign: 0 */
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const getLogger = require('./src/utils/logger');

const {
  PORT,
} = process.env;

const app = express();

const logger = getLogger(__filename);

app.use(helmet());
app.use(bodyParser.json());

const usersRouter = require('./src/routes/users');

app.use('/users', usersRouter);

// eslint-disable-next-line
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(PORT, () => {
  logger.info(`Server listening on localhost:${PORT}`);
});

module.exports = app;