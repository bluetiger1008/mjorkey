'use strict';

import angular from 'angular';

export default angular.module('majorkeyApp.initService', [])
  .service('initService',function(){
    this.purchasedTickets = {
      vip: 0,
      general: 0,
      totalPrice: 0
    };
    this.choosedCampaignId = '';
  })
  .name;
