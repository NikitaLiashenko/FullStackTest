const express = require('express');
const uuid = require('uuid');
const getLogger = require('../utils/logger');

const logger = getLogger(__filename);

const router = express.Router();

router.post('/', async(req, res, next) => {
  const { amount } = req.body;
  try {
    // transaction processing simulation

    const newTransaction = {
      id: uuid.v4(),
      amount,
    };

    res.json(newTransaction);
  } catch (error) {
    logger.error('Error happen:');
    logger.error(error);
    next(error);
  }
});

module.exports = router;