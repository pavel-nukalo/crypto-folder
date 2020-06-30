var passport = require('passport');

var userModel = require('../models/user');

require('./local');

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (user_id, done) {
  userModel.get(user_id)
    .then(function (user) {
      done(null, user);
    })
    .catch(function (err) {
      done(err);
    });
});

passport.authenticationMiddleware = function () {
  return function (req, res, next) {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    next();
  };
};