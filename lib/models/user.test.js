const User = require('./User');

describe('user model', () => {
  it('hashes password', () => {
    //when we create a user, we create a user with: 
    const user = new User({
      username: 'suri',
      password: 'secretePassword'
    });
    //when we turn our user into json and grab the passwordhash, we expect to exist
    expect(user.toJSON().passwordHash).toEqual(expect.any(String));
    //we dont want the actual password to exist. We only want the passwordHarsh 
    expect(user.toJSON().password).toBeUndefined();
  });
});
