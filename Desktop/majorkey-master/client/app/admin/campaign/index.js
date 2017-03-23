'use strict';

import angular from 'angular';
import CampaignController from './campaign.controller';

export default angular.module('majorkeyApp.campaignAdmin', ['majorkeyApp.auth', 'ui.router'])
  .controller('CampaignController', CampaignController)
  .name;
