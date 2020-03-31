require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

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
  it('logs in a user', async() => {
    await User.create({ username: 'suri', password: 'secretPassword' });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'suri', password: 'secretPassword' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'suri',
          __v: 0
        });
      });
  });
  it('fails to login a user with bad password', async() => {
    await User.create({ username: 'suri', password: 'secretepassword' });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'suri', password: 'badPassword!oops' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid username/password',  // because we send a bad password
          status: 403
        });
      });
  });
});

