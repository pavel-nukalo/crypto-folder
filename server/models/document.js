const db = require('../db');
const ObjectID = require('mongodb').ObjectID;

const collection = 'documents';

exports.getAll = () => db.get().collection(collection).find().project({ data: 0 }).toArray();

exports.get = id => {
  if (!ObjectID.isValid(id)) {
    return Promise.reject(new Error('ObjectID is not valid'));
  }

  return db.get().collection(collection).findOne({ _id: ObjectID(id) });
};

exports.update = (id, doc) => db.get().collection(collection).findOneAndUpdate({ _id: ObjectID(id) }, { $set: doc });

exports.create = async doc => {
  const result = await db.get().collection(collection).insertOne(doc);
  return result.ops[0];
};

exports.delete = id => db.get().collection(collection).deleteOne({ _id: ObjectID(id) });