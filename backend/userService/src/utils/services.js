const axios = require('axios');

const {
  TRANSACTION_SERVICE_URL,
} = process.env;

const doTransaction = (userId, amount) => axios
  .post(
    `${TRANSACTION_SERVICE_URL}/transactions`,
    {
      userId,
      amount,
    },
  )
  .then(({ data }) => data);

module.exports = {
  transactionService: {
    doTransaction,
  },
};