const User = require('../models/User');
module.exports = (req, res, next) => {
  //read the session cookie
  //cookies becomes an obj with all the cookies that have been set.
  
  const token = req.cookies.session;
  //check our JWT
  User
    .findByToken(token)
  //we'll get back our user 
    .then(user => {
    //set a user if the JWT is valid
      req.user = user;
      next();
    })
  //otherwise send an error
    .catch(next);
};

