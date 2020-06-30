const express = require('express');
const router = express.Router();
const passport = require('passport');
const randomstring = require('randomstring');

const config = require('../config');
const mailer = require('../mailer');
const userModel = require('../models/user');

router.post('/signin/email', async (req, res) => {
  try {
    const user = await userModel.getUserByEmail(req.body.email);

    if (!user) {
      throw new Error('Incorrect email');
    }

    const code = randomstring.generate(config.emailAuthentication.code.randomstring);

    await mailer.sendMail(user.email, 'server/views/auth_email_template.ejs', {
      code,
      expires: config.emailAuthentication.expires
    });

    const date = new Date();
    date.setMinutes(date.getMinutes() + config.emailAuthentication.expires);
    const expires = date.toISOString();

    await userModel.update(user._id, { emailAuthentication: { code, expires } });

    res.sendStatus(200);
  } catch (e) {
    res.status(401).send({ message: e.message });
  }
});

router.post('/signin/code', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send({ message: info.message });

    req.logIn(user, (err) => {
      if (err) next(err);
      else res.sendStatus(200);
    });
  })(req, res, next);
});

router.get('/signout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

module.exports = router;