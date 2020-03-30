const mongoose = require('mongoose');
const { hashSync } = require('bcryptjs');


const schema = new mongoose.Schema({
  username:{
    type: String, 
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});
// the goal of this password virtual is to let the user create itself with a password, take that clear text password and hash it and only save the password hashed in our db and not the clear text password 
//use a virtual so we never save a plain text password in out db
schema.virtual('password').set(function(password) {
    
  //hash the password with bcrypt hash algortithm 
  //we are going to give it the password we want to hash in the number of rounds to use while hashing
  const hash = hashSync(password, 10);
  //set this.passwordHash to the hashed password
  this.passwordHash = hash;
});

schema.statics.authorize = function({ usernmame, password }) {
  //check that the user exists with username
  //check that the user with the username has a matching password
  //if both conditions are true return the user 
  //otherwise throw an error
};

schema.methods.authToken = function() {
  //use jsonwebtoken to create a token for our user and return it
};

module.exports = mongoose.model('User', schema);