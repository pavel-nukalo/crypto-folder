const passport = require('passport');
const userModel = require('../models/user');
require('./local');

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (user_id, done) => {
  try {
    const user = await userModel.get(user_id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.authenticationMiddleware = () => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    next();
  };
};