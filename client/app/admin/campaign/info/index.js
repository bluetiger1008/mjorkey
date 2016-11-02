'use strict';

import angular from 'angular';
import CampaignAdminInfoController from './info.controller';

export default angular.module('majorkeyApp.campaignAdminInfo', ['majorkeyApp.auth', 'ui.router'])
  .controller('CampaignAdminInfoController', CampaignAdminInfoController)
  .name;
