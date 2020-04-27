const _ = require('lodash');
const uuid = require('uuid');
const users = require('./db.json');
const {
  AppError,
} = require('../errors');

const getAllUsersInfo = () => {
  const filteredInfo = users.map(user => _.pick(user, ['id', 'firstName', 'lastName']));
  return Promise.resolve(filteredInfo);
};

const getUserById = (id) => {
  const user = users.find(person => person.id === id);

  if (!user) {
    throw new AppError('User with such id not found', 404);
  }

  return Promise.resolve(user);
};

const createAccount = (id, initialCredit) => {
  const userIndex = users.findIndex(person => person.id === id);

  if (userIndex < 0) {
    throw new AppError('User with such id not found', 404);
  }

  if (users[userIndex].balance < initialCredit) {
    throw new AppError('User has insufficient balance for this operation', 400);
  }

  const newAccount = {
    id: uuid.v4(),
    balance: 0,
  };

  users[userIndex].accounts.push(newAccount);

  return Promise.resolve(newAccount);
};

const updateBalance = (userId, accountId, amount) => {
  const userIndex = users.findIndex(person => person.id === userId);
  if (userIndex < 0) {
    throw new AppError('User with such id not found', 404);
  }

  const accountIndex = users[userIndex].accounts.findIndex(account => account.id === accountId);
  if (accountIndex < 0) {
    throw new AppError('User does not have account with such id', 404);
  }

  if (users[userIndex].balance < amount) {
    throw new AppError('User has insufficient balance for this operation', 400);
  }

  users[userIndex].balance -= amount;
  users[userIndex].accounts[accountIndex].balance = amount;

  return Promise.resolve();
};

const addTransaction = (userId, transaction) => {
  const userIndex = users.findIndex(person => person.id === userId);
  if (userIndex < 0) {
    throw new AppError('User with such id not found', 404);
  }

  users[userIndex].transactions.push(transaction);

  return Promise.resolve();
};


module.exports = {
  getAllUsersInfo,
  getUserById,
  createAccount,
  updateBalance,
  addTransaction,
};