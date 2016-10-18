'use strict';

var express = require('express');
var controller = require('./stripe.controller');

var router = express.Router();
var stripe = require('stripe')('sk_test_JfliVks9eGKRKSJ56nefh31z Roll Key');

router.post('/', controller.create);

module.exports = router;
