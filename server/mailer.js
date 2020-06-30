const nodemailer = require('nodemailer');
const ejs = require('ejs');
const config = require('../config');

const transporter = nodemailer.createTransport(config.nodemailer);

exports.sendMail = async (to, view, doc) => {
  const html = await new Promise((resolve, reject) => {
    ejs.renderFile(view, doc, (err, html) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(html);
    });
  });

  return transporter.sendMail(Object.assign({}, config.mailOptions, { html, to }));
};