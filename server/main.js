var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var passport = require('passport');
require('./authentication/init');

var config = require('./config');
var db = require('./db');
var apiRouter = require('./routes/api');

var app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static('./client/dist'));

db.connect()
  .then(function () {
    app.use(expressSession(Object.assign(config.expressSession, {
      store: new MongoStore({
        client: db.getClient(),
        dbName: config.mongodb.dbName
      })
    })));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/api', apiRouter);
  })
  .then(function () {
    var httpServer = http.createServer(app);

    httpServer.listen(config.http.port, config.http.hostname, function () {
      console.log (`App listen http://${config.http.hostname}:${config.http.port}`);
    });

    if (config.https && config.https.enable) {
    	var httpsOptions = {
    	  key: fs.readFileSync(config.https.ssl.key, 'utf8'),
    	  cert: fs.readFileSync(config.https.ssl.cert, 'utf8')
    	};

    	var httpsServer = https.createServer(httpsOptions, app);

    	httpsServer.listen(config.https.port, config.https.hostname, function () {
    		console.log (`App listen https://${config.https.hostname}:${config.https.port}`);
    	});
    }
  })
  .catch(function (err) {
    console.log(err);
  });