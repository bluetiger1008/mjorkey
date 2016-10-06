import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './campaign.routes';

export class CampaignController {

  /*@ngInject*/
  constructor($http, $scope, socket, campaignFactory) {
    this.$http = $http;
    this.socket = socket;
    this.campaignFactory = campaignFactory;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('campaign');
    });
  }

  $onInit() {
    this.campaignFactory.getCampaigns()
      .then(response => {
        // console.log(response.data);
        this.campaigns = response.data;
        this.socket.syncUpdates('campaign', this.campaigns);
      });
  }

  addCampaign() {
    if(this.newCampaign) {
      // this.$http.post('/api/campaigns', {
      //   artistName: this.newCampaign
      // });
      this.newCampaign = '';
      this.campaignFactory.addCampaign(this.newCampaign);
      
    }
  }
}

export default angular.module('majorkeyApp.campaign', [uiRouter])
  .config(routing)
  .component('campaign', {
    template: require('./campaign.html'),
    controller: CampaignController
  })
  .name;
