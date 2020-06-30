const express = require('express');
const router = express.Router();
const passport = require('passport');
const documentsController = require('../controllers/documents');
const authenticationRouter = require('./authentication');

router.use('/authentication', authenticationRouter);

router.get('/documents/', passport.authenticationMiddleware(), documentsController.getAll);

router.get('/documents/:id', passport.authenticationMiddleware(), documentsController.get);

router.put('/documents/:id', passport.authenticationMiddleware(), documentsController.update);

router.post('/documents/', passport.authenticationMiddleware(), documentsController.create);

router.delete('/documents/:id', passport.authenticationMiddleware(), documentsController.delete);

module.exports = router;