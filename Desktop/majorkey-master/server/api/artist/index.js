'use strict';

var express = require('express');
var controller = require('./artist.controller');
var multer  =   require('multer');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);
router.post('/photo', controller.uploadPhoto);

module.exports = router;
