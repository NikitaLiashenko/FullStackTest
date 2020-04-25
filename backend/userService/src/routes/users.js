const express = require('express');
const db = require('../db');
const getLogger = require('../utils/logger');
const { transactionService } = require('../utils/services');

const logger = getLogger(__filename);

const router = express.Router();

router.get('/info', async (req, res, next) => {
  try {
    const users = await db.getAllUsersInfo();

    res.json(users);
  } catch (error) {
    logger.error('Error happen:');
    logger.error(error);
    next(error);
  }
});

router.get('/:userId/info', async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await db.getUserById(userId);

    res.json(user);
  } catch (error) {
    logger.error('Error happen:');
    logger.error(error);
    next(error);
  }
});


router.post('/:userId/account', async(req, res, next) => {
  const { userId } = req.params;
  const { initialCredit } = req.body;

  try {
    const account = await db.createAccount(userId, initialCredit);

    if (initialCredit > 0) {
      const transaction = await transactionService.doTransaction(userId, initialCredit);

      await db.addTransaction(userId, transaction);

      await db.updateBalance(userId, account.id, initialCredit);
    }

    res.end();
  } catch (error) {
    logger.error('Error happen:');
    logger.error(error);
    next(error);
  }
});

module.exports = router;