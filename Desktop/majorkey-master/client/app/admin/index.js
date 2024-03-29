'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './admin.routes';

import AdminController from './admin.controller';

export default angular.module('majorkeyApp.admin', ['majorkeyApp.auth', 'ui.router'])
  .config(routes)
  .controller('AdminController', AdminController)
  .name;
