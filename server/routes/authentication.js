var express = require('express');
var router = express.Router();
var passport = require('passport');
var randomstring = require('randomstring');

var config = require('../config');
var mailer = require('../mailer');
var userModel = require('../models/user');

router.post('/signin/email', function (req, res) {
  userModel.getUserByEmail(req.body.email)
    .then(function (user) {
      if (user) {
        var code = randomstring.generate(config.emailAuthentication.code.randomstring);
        
        return mailer.sendMail('server/views/auth_email_template.ejs', { code, expires: config.emailAuthentication.expires })
          .then(function () {
            return { user_id: user._id, code };
          });
      } else return Promise.reject({ message: 'Incorrect email' }); 
    })
    .then(function ({ user_id, code }) {
      var date = new Date();
      date.setMinutes(date.getMinutes() + config.emailAuthentication.expires);
      var expires = date.toISOString();
      
      return userModel.update(user_id, { emailAuthentication: { code, expires } });
    })
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      if (!err) err = new Error('Internal server error');
      
      res.status(401).send({ message: err.message });
    });
});

router.post('/signin/code', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) return next(err);  
    if (!user) return res.status(401).send({ message: info.message });

    req.logIn(user, function (err) {
      if (err) next(err);
      else res.sendStatus(200);
    });
  })(req, res, next);
});

router.get('/signout', function (req, res) {
  req.logout();
  res.sendStatus(200);
});

module.exports = router;