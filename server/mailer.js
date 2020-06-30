var nodemailer = require('nodemailer');
var ejs = require('ejs');
var config = require('../config');

var transporter = nodemailer.createTransport(config.nodemailer);

exports.sendMail = function (view, doc) {
	return new Promise(function (resolve, reject) {
		ejs.renderFile(view, doc, function (err, html) {
			if (err) reject(err);
			else resolve(html);
		});
	})
		.then(function (html) {
			return transporter.sendMail(Object.assign(config.mailOptions, { html }));
		});
};