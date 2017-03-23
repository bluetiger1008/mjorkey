'use strict';

var express = require('express');
var controller = require('./stripe.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();


router.get('/:id', auth.isAuthenticated(), controller.getCardInfo);
router.post('/createCard', auth.isAuthenticated(), controller.createCard );
router.post('/createCharge', auth.isAuthenticated(), controller.createCharge );

module.exports = router;
