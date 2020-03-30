const User = require('./lib/models/User');

const user = new User({
  username: 'suri',
  password: 'somepassword'
});

console.log(user.toJSON());
