var db = require('../db');
var ObjectID = require('mongodb').ObjectID;

var collection = 'documents';

exports.getAll = function () {
  return db.get().collection(collection).find().toArray();
};

exports.get = function (id) {
  if (!ObjectID.isValid(id)) return Promise.reject();
  
  return db.get().collection(collection).findOne({ _id: ObjectID(id) });
};

exports.update = function (id, doc) {
  return db.get().collection(collection).findOneAndUpdate({ _id: ObjectID(id) }, { $set: doc });
};

exports.create = function (doc) {
  return db.get().collection(collection).insertOne(doc)
    .then(function (result) {
      return result.ops[0];
    });
};

exports.delete = function (id) {
  return db.get().collection(collection).deleteOne({ _id: ObjectID(id) });
};