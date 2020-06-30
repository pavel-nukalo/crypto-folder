var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var userModel = require('../models/user');

var strategy = new LocalStrategy({ usernameField: 'email', passwordField: 'code' }, function (email, code, done) {
  userModel.getUserByEmail(email)
    .then(function (user) {
      if (!user) return done(null, false, { message: 'Incorrect email' });
      if (!user.emailAuthentication) return done(null, false, { message: 'Authentication code not sent' });
      if (user.emailAuthentication.code != code) return done(null, false, { message: 'Invalid authentication code' });
      if (new Date() > new Date(user.emailAuthentication.expires)) return done(null, false, { message: 'Expired authentication code' });
      
      done(null, user);
    })
    .catch(function (err) {
      done(err, null);
    });
});

passport.use(strategy);