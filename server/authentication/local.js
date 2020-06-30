const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const userModel = require('../models/user');

const strategy = new LocalStrategy({ usernameField: 'email', passwordField: 'code' }, async (email, code, done) => {
  try {
    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return done(null, false, { message: 'Incorrect email' });
    }

    if (!user.emailAuthentication) {
      return done(null, false, { message: 'Authentication code not sent' });
    }

    if (user.emailAuthentication.code != code) {
      return done(null, false, { message: 'Invalid authentication code' });
    }

    if (new Date() > new Date(user.emailAuthentication.expires)) {
      return done(null, false, { message: 'Expired authentication code' });
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(strategy);