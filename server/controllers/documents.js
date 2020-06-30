const documentModel = require('../models/document');

exports.getAll = async (req, res) => {
  try {
    const docs = await documentModel.getAll();
    res.json(docs);
  } catch (e) {
    res.sendStatus(500);
  }
};

exports.get = async (req, res) => {
  try {
    const doc = await documentModel.get(req.params.id);
    res.json(doc);
  } catch (e) {
    res.sendStatus(500);
  }
};

exports.update = async (req, res) => {
  try {
    const doc = {
      lastModified: new Date().toISOString()
    };

    if (req.body.name) doc.name = req.body.name;
    if (req.body.data) doc.data = req.body.data;

    await documentModel.update(req.params.id, doc);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
};

exports.create = async (req, res) => {
  try {
    const doc = await documentModel.create({
      name: req.body.name,
      data: req.body.data,
      lastModified: new Date().toISOString()
    });
    res.status(201).json(doc);
  } catch (e) {
    res.sendStatus(500);
  }
};

exports.delete = async (req, res) => {
  try {
    await documentModel.delete(req.params.id);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
};