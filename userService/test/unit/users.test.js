/* eslint no-param-reassign: 0 */
const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');
const chai = require('chai');
const proxyquire = require('proxyquire');

const { expect } = chai;

const app = express();
app.use(bodyParser.json());

describe('users router', () => {
  const usersRoute = proxyquire(
    '../../src/routes/users',
    {
      '../utils/services': {
        transactionService: {
          doTransaction: (userId, initialCredit) => {
            if (initialCredit > 1000) {
              throw new Error('Something happen');
            }

            return Promise.resolve({
              id: '12345',
              amount: initialCredit,
            });
          },
        },
      },
    },
  );

  app.use(usersRoute);

  // eslint-disable-next-line
  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });

  context('route is wrong', () => {
    it('should return 404', (done) => {
      request(app)
        .get('/wrongRoute')
        .expect(404)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.status).to.equal(404);
            done();
          }
        });
    });
  });

  context('/info', () => {
    it('should return 200 and initial setup if everything is ok', (done) => {
      const initial = [
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

      request(app)
        .get('/info')
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.body.length).to.equal(2);
            expect(res.body).to.deep.equal(initial);
            done();
          }
        });
    });
  });

  context(':userId/info', () => {
    it('should return 200 if id exists', (done) => {
      const testResponse = {
        id: 'a319c719-bd49-49a8-8ece-c9a5b047fa77',
        firstName: 'John',
        lastName: 'Doe',
        balance: 900,
      };

      request(app)
        .get(`/${testResponse.id}/info`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.body).to.have.property('accounts').that.is.a('array');
            expect(res.body).to.have.property('transactions').that.is.a('array');
            delete res.body.accounts;
            delete res.body.transactions;
            expect(res.body).to.deep.equal(testResponse);
            done();
          }
        });
    });

    it('should return 404 if id is wrong', (done) => {
      const testResponse = {
        message: 'User with such id not found',
        status: 'fail',
      };

      request(app)
        .get('/12345/info')
        .expect(404)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.body).to.deep.equal(testResponse);
            done();
          }
        });
    });
  });

  context('/:userId/account', () => {
    it('should return 404 if id is wrong', (done) => {
      const testResponse = {
        message: 'User with such id not found',
        status: 'fail',
      };

      request(app)
        .post('/12345/account')
        .send({})
        .expect(404)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.body).to.deep.equal(testResponse);
            done();
          }
        });
    });

    it('should return 400 if user has insufficient funds', (done) => {
      const testResponse = {
        message: 'User has insufficient balance for this operation',
        status: 'fail',
      };

      request(app)
        .post('/a319c719-bd49-49a8-8ece-c9a5b047fa77/account')
        .send({
          initialCredit: 2000,
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.body).to.deep.equal(testResponse);
            done();
          }
        });
    });

    it('should return 500 if transaction request failed', (done) => {
      const testResponse = {
        message: 'Something happen',
        status: 'error',
      };

      request(app)
        .post('/c90aadc8-da3f-4a26-b6db-6ae2d4bfb937/account')
        .send({
          initialCredit: 2000,
        })
        .expect(500)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.body).to.deep.equal(testResponse);
            done();
          }
        });
    });

    it('should return 200 if everything is ok', (done) => {
      const testResponse = {};

      request(app)
        .post('/a319c719-bd49-49a8-8ece-c9a5b047fa77/account')
        .send({
          initialCredit: 100,
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.body).to.deep.equal(testResponse);
            done();
          }
        });
    });
  });
});