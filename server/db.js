var MongoClient = require('mongodb').MongoClient;
var config = require('./config');

var state = {
  db: null,
  client: null
};

exports.get = function () {
  return state.db;
};

exports.getClient = function () {
  return state.client;
};

exports.connect = function (done) {
  if (state.db) {
    return Promise.resolve();
  }

  var options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
  };

  return MongoClient.connect(config.mongodb.url, options)
    .then(function (client) {
      state.client = client;
      state.db = client.db();
    });
};