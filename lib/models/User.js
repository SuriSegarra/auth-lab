const mongoose = require('mongoose');
const { hashSync, compare } = require('bcryptjs');
//sign creates a new jwt 
const { sign, verify } = require('jsonwebtoken');

const schema = new mongoose.Schema({
  username:{
    type: String, 
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, {
  //function that gets call whenever we call this,.toJSON(). automatically deletes passwordHash
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
    }
  }
});
// the goal of this password virtual is to let the user create itself with a password, take that clear text password and hash it and only save the password hashed in our db and not the clear text password 
//use a virtual so we never save a plain text password in out db
schema.virtual('password').set(function(password) {
    
  //hash the password with bcrypt hash algortithm 
  //we are going to give it the password we want to hash in the number of rounds to use while hashing
  const hash = hashSync(password, Number(process.env.SALT_ROUNDS) || 14);
  //set this.passwordHash to the hashed password
  this.passwordHash = hash;
});

schema.statics.authorize = async function({ username, password }) {
  //check that the user exists with username
  const user = await this.findOne({ username });
  if(!user) {
    //throw an error
    const error = new Error('Invalid username/password');
    error.status = 403;
    throw error;
  } 
  // check that the user with username has a matching password
  const matchingPasswords = await compare(password, user.passwordHash);
  if(!matchingPasswords) {
    // throw an error
    const error = new Error('Invalid username/password');
    error.status = 403;//Forbidden error
    throw error;
  }
  // if both conditions are true return the user
  return user;

  // otherwise throw an error
};

//for signup and login
//take a user and create a token 
schema.methods.authToken = function() {
  //remove passwordHash 
//   const jsonfiedUser = this.toJSON();
//   delete jsonfiedUser.passwordHash; handlen by out JSON transform

  //use jsonwebtoken to create a token for our user and return it
  //payload encode that information inside of the token 
  const token = sign({ payload: this.toJSON() }, process.env.APP_SECRET);

  return token;
};
//mongoose document => plain old js obj (pojo) (.toJSON)
//pojo -> mongoose document(hydrate)

//ensure auth middleware
//take a token and get a user 
schema.statics.findByToken = function(token){
  try {
  //take a token 
  //payload is our user 
    const { payload } = verify(token, process.env.APP_SECRET);
    //return a user who owns a token
    return Promise.resolve(this.hydrate(payload));
  } catch(e) {
    return Promise.reject(e);
  }
};

module.exports = mongoose.model('User', schema);
