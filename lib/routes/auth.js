const { Router } = require('express');
const User = require('../models/User');

const One_day_in_ms = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/signup', (req, res, next) => {
    //create a new user
    User
      .create(req.body)
      .then(user => {
        //create a jwt 
        const token = user.authToken();
        //send the user and JWT
        //we're using cookies instead on LS because is overall pretty secure 
        res.cookie('session', token, {
          maxAge: One_day_in_ms,
          httpOnly: true
        });
        res.send(user);
      })
      .catch(next);
  });
