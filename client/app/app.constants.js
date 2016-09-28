'use strict';

import angular from 'angular';

export default angular.module('majorkeyApp.constants', [])
  .constant('appConfig', require('../../server/config/environment/shared'))
  .name;
