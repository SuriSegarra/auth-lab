require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

describe('auth routes', () => {
  beforeAll(() => {
    connect();
  });
  
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('sign up  a user', () => {
    //make a request on our application
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'suri', password: 'secretPassword' })
      //we get a response 
      .then(res => {
        //we expect the response body to equal: 
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'suri',
          __v: 0
        });
      });
  });
});
