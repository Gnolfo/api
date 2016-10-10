var LocalStrategy = require('passport-local').Strategy;
var User = require('../../../../models/api/users');
var hasher = require('../../../../util/hasher');


/**
 * Local username/password implementation of Passport "local strategy".
 * The exported object should be plugged into a `passport.use(...)` call
 */
module.exports = new LocalStrategy(
  function(username, password, cb) {
    User.findOne({
      where: {
        username: username.toLowerCase()
      }
    })
    .then(function(user) {
      if ( !user) {
        // No user found with that username
        return cb('Incorrect Username');
      }

      if (!user.isActive()) {
        // No user found with that username
        return cb('Account is Either Inactive of Banned');
      }

      // Check password
      hasher.verify(password, user.password)
      .then(function(isValid) {
        if (isValid === true) {
          return cb(null, user);
        } else {
          // Incorrect password
          return cb('Incorrect Password');
        }
      });
    })
    .catch(cb);
  }
);
