var documentModel = require('../models/document');

exports.getAll = function (req, res) {
  documentModel.getAll()
    .then(function (docs) {
      res.json(docs);
    })
    .catch(function () {
      res.sendStatus(500);
    });
};

exports.get = function (req, res) {
  documentModel.get(req.params.id)
    .then(function (doc) {
      res.json(doc);
    })
    .catch(function() {
      res.sendStatus(500);
    });
};

exports.update = function (req, res) {
  var doc = {
    lastModified: new Date().toISOString()
  };
  
  if (req.body.name) doc.name = req.body.name;
  if (req.body.data) doc.data = req.body.data;
  
  documentModel.update(req.params.id, doc)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function () {
      res.sendStatus(500);
    });
};

exports.create = function (req, res) {
  var doc = {
    name: req.body.name,
    data: req.body.data,
    lastModified: new Date().toISOString()
  };

  documentModel.create(doc)
    .then(function (doc) {
      res.json(doc);
    })
    .catch(function () {
      res.sendStatus(500);
    });
};

exports.delete = function (req, res) {
  documentModel.delete(req.params.id)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function () {
      res.sendStatus(500);
    });
};