const db = require('../db');
const ObjectID = require('mongodb').ObjectID;

const collection = 'users';

exports.get = id => db.get().collection(collection).findOne({ _id: ObjectID(id) });

exports.getUserByEmail = email => db.get().collection(collection).findOne({ email });

exports.update = (id, doc) => db.get().collection(collection).findOneAndUpdate({ _id: ObjectID(id) }, { $set: doc });