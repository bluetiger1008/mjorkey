import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './campaign.routes';

export class CampaignController {

  /*@ngInject*/
  constructor($http, $scope, socket, campaignFactory, $state) {
    this.$http = $http;
    // this.socket = socket;
    this.campaignFactory = campaignFactory;
    this.$state = $state;

    // $scope.$on('$destroy', function() {
    //   socket.unsyncUpdates('campaign');
    // });
  }

  $onInit() {
    this.campaignFactory.getCampaigns()
      .then(response => {
        // console.log(response.data);
        this.campaigns = response.data;
        // this.socket.syncUpdates('campaign', this.campaigns);
      });
  }

  goCampaignInfo(campaign) {
    this.$state.go('campaignInfo', {campaignID: campaign._id});
  }
}

export default angular.module('majorkeyApp.campaign', [uiRouter])
  .config(routing)
  .component('campaign', {
    template: require('./campaign.html'),
    controller: CampaignController
  })
  .name;
