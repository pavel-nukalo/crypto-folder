var db = require('../db');
var ObjectID = require('mongodb').ObjectID;

var collection = 'users';

exports.get = function (user_id) {
  return db.get().collection(collection).findOne({ _id: ObjectID(user_id) });
};

exports.getUserByEmail = function (email) {
  return db.get().collection(collection).findOne({ email });
};

exports.update = function (id, doc) {
  return db.get().collection(collection).findOneAndUpdate({ _id: ObjectID(id) }, { $set: doc });
};