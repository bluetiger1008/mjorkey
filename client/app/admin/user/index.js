'use strict';

import angular from 'angular';
import UserController from './user.controller';

export default angular.module('entusicApp.user', ['entusicApp.auth', 'ui.router'])
  .controller('UserController', UserController)
  .name;
