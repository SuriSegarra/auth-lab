require('dotenv').config();
const User = require('./User');

describe('user model', () => {
  it('hashes password', () => {
    //when we create a user, we create a user with: 
    const user = new User({
      username: 'suri',
      password: 'secretePassword'
    });
    //when we turn our user into json and grab the passwordhash, we expect to exist
    expect(user.passwordHash).toEqual(expect.any(String));
    //we dont want the actual password to exist. We only want the passwordHarsh 
    expect(user.toJSON().password).toBeUndefined();
  });
  it('creates a jwt auth token', () => {
    const user = new User ({
      username: 'suri',
      password: 'secretePassword'
    });
    const token = user.authToken();
    //puso 'not.toBeUndefined' porque quiere que sea definido = es el opuestp
    expect(token).not.toBeUndefined();
  });
  //we will be using this when they come and hit one of our routes, we want to make sure the token is associated with the user. 

  //we will take the token and lookup the user who used the token 
  it('finds a user by token', () => {
    //we create a user
    const user = new User ({
      username: 'suri',
      password: 'secretePassword'
    });
    //we create a token from that user 
    const token = user.authToken();
    //we call user .findByToken we expect back a user that equal the original user whgo created the token 

    //let us conver token into user 
    User
      .findByToken(token)
      .then(founduser => {
        expect(founduser.toJSON()).toEqual(user.toJSON());
      });
  });
});
