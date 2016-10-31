'use strict';

var express = require('express');
var controller = require('./stripe.controller');

var router = express.Router();


router.post('/', controller.charge);
router.get('/:id', controller.getCardInfo);
router.post('/createCustomer', controller.createCustomer );
router.post('/createCard', controller.createCard );
router.post('/createCharge', controller.createCharge );

module.exports = router;
