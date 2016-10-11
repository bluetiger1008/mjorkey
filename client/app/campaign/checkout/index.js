'use strict';

import angular from 'angular';
import CheckoutController from './checkout.controller';

export default angular.module('majorkeyApp.checkout', [])
  .controller('CheckoutController', CheckoutController)
  .name;
