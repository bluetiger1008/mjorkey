'use strict';

import angular from 'angular';
import InfoController from './info.controller';

export default angular.module('majorkeyApp.campaignInfo', [])
  .controller('InfoController', InfoController)
  .name;
