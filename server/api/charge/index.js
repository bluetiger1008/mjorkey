'use strict';

var express = require('express');
var controller = require('./stripe.controller');

var router = express.Router();


router.post('/', controller.charge);

module.exports = router;
