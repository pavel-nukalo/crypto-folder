module.exports = {
  http: {
    hostname: 'localhost',
    port: 3204
  },

  https: {
    hostname: '0.0.0.0',
    port: 443,
    ssl: {
      key: '',
      cert: ''
    },
    enable: false
  },

  mongodb: {
    url: ''
  },

  expressSession: {
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365
    }
  },

  nodemailer: {
    service: 'Gmail',
    auth: {
      user: '',
      pass: ''
    }
  },

  mailOptions: {
    from: 'CryptoFolder',
    to: '',
    subject: 'Код аутентификации'
  },

  emailAuthentication: {
    expires: 2, // minutes
    code: {
      randomstring: {
        length: 5,
        charset: 'numeric'
      }
    }
  }
};