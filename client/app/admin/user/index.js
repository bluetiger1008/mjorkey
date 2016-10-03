'use strict';

import angular from 'angular';
import UserController from './user.controller';

export default angular.module('majorkeyApp.user', ['majorkeyApp.auth', 'ui.router'])
  .controller('UserController', UserController)
  .name;
