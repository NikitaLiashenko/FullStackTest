const { expect } = require('chai');
const db = require('../../src/db');

describe('db test', () => {
  context('getAllUsersInfo', () => {
    it('should return proper result', async() => {
      const testResult = [
        {
          id: 'a319c719-bd49-49a8-8ece-c9a5b047fa77',
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          id: 'c90aadc8-da3f-4a26-b6db-6ae2d4bfb937',
          firstName: 'Kate',
          lastName: 'Smith',
        },
      ];

      const result = await db.getAllUsersInfo();
      expect(result).to.deep.equal(testResult);
    });
  });

  context('getUserById', () => {
    it('should throw if id is wrong', async() => {
      const testId = '12345';

      try {
        await db.getUserById(testId);
      } catch (error) {
        expect(error.message).to.equal('User with such id not found');
        expect(error.statusCode).to.equal(404);
        expect(error.status).to.equal('fail');
      }
    });

    it('should return proper result', async() => {
      const testId = 'a319c719-bd49-49a8-8ece-c9a5b047fa77';
      const testResult = {
        id: 'a319c719-bd49-49a8-8ece-c9a5b047fa77',
        firstName: 'John',
        lastName: 'Doe',
        balance: 1000,
        transactions: [],
        accounts: [],
      };

      const result = await db.getUserById(testId);
      expect(result).to.deep.equal(testResult);
    });
  });

  context('createAccount', () => {
    it('should throw if id is wrong', async() => {
      const testId = '12345';
      const testInitialCredit = 2000;

      try {
        await db.createAccount(testId, testInitialCredit);
      } catch (error) {
        expect(error.message).to.equal('User with such id not found');
        expect(error.statusCode).to.equal(404);
        expect(error.status).to.equal('fail');
      }
    });

    it('should throw if user have insufficient funds', async() => {
      const testId = 'a319c719-bd49-49a8-8ece-c9a5b047fa77';
      const testInitialCredit = 2000;

      try {
        await db.createAccount(testId, testInitialCredit);
      } catch (error) {
        expect(error.message).to.equal('User has insufficient balance for this operation');
        expect(error.statusCode).to.equal(400);
        expect(error.status).to.equal('fail');
      }
    });

    it('should return proper result if everything is ok', async() => {
      const testId = 'a319c719-bd49-49a8-8ece-c9a5b047fa77';
      const testInitialCredit = 100;

      const result = await db.createAccount(testId, testInitialCredit);

      expect(result).to.have.property('id').that.is.a('string');
    });
  });

  context('createAccount', () => {
    it('should throw if user id is wrong', async() => {
      const testUserId = '12345';
      const testAccountId = '12345';
      const testInitialCredit = 2000;

      try {
        await db.updateBalance(testUserId, testAccountId, testInitialCredit);
      } catch (error) {
        expect(error.message).to.equal('User with such id not found');
        expect(error.statusCode).to.equal(404);
        expect(error.status).to.equal('fail');
      }
    });

    it('should throw if account id is wrong', async() => {
      const testUserId = 'a319c719-bd49-49a8-8ece-c9a5b047fa77';
      const testAccountId = '12345';
      const testInitialCredit = 2000;

      try {
        await db.updateBalance(testUserId, testAccountId, testInitialCredit);
      } catch (error) {
        expect(error.message).to.equal('User does not have account with such id');
        expect(error.statusCode).to.equal(404);
        expect(error.status).to.equal('fail');
      }
    });

    it('should throw if user have insufficient funds', async() => {
      const testUserId = 'a319c719-bd49-49a8-8ece-c9a5b047fa77';
      const user = await db.getUserById(testUserId);
      const testAccountId = user.accounts[0].id;
      const testInitialCredit = 2000;

      try {
        await db.updateBalance(testUserId, testAccountId, testInitialCredit);
      } catch (error) {
        expect(error.message).to.equal('User has insufficient balance for this operation');
        expect(error.statusCode).to.equal(400);
        expect(error.status).to.equal('fail');
      }
    });

    it('should return proper result if everything is ok', async() => {
      const testUserId = 'a319c719-bd49-49a8-8ece-c9a5b047fa77';
      const user = await db.getUserById(testUserId);
      const testAccountId = user.accounts[0].id;
      const testInitialCredit = 100;

      await db.updateBalance(testUserId, testAccountId, testInitialCredit);
    });
  });

  context('addTransaction', () => {
    it('should throw if id is wrong', async() => {
      const testId = '12345';

      try {
        await db.addTransaction(testId);
      } catch (error) {
        expect(error.message).to.equal('User with such id not found');
        expect(error.statusCode).to.equal(404);
        expect(error.status).to.equal('fail');
      }
    });

    it('should return proper result if everything is ok', async() => {
      const testId = 'a319c719-bd49-49a8-8ece-c9a5b047fa77';
      const testTransaction = {
        someKey: 'someValue',
      };

      await db.addTransaction(testId, testTransaction);
    });
  });
});