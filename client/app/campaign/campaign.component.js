import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './campaign.routes';

export class CampaignController {

  /*@ngInject*/
  constructor($http, $scope, socket, campaignFactory, $state, Auth, initService) {
    this.$http = $http;
    // this.socket = socket;
    this.campaignFactory = campaignFactory;
    this.$state = $state;
    this.Auth = Auth;
    this.getCurrentUser = this.Auth.getCurrentUserSync;
    this.currentUser = this.getCurrentUser();
    this.loggedIn = false;
    this.initService = initService;
    // $scope.$on('$destroy', function() {
    //   socket.unsyncUpdates('campaign');
    // });
  }

  $onInit() {
    this.initService.currentPage = {
      state: '',
      id: ''
    };
    if(this.currentUser._id!="")
      this.loggedIn = true;
    else
      this.loggedIn = false;
    console.log(this.loggedIn);

    this.campaignFactory.getCampaigns()
      .then(response => {
        // console.log(response.data);
        this.campaigns = response.data;
        if(this.currentUser){
          for(var i=0; i<this.campaigns.length; i++){
            for (var j=0; j<this.campaigns[i].purchased_users.length; j++){
              if(this.campaigns[i].purchased_users[j] == this.currentUser._id){
                this.campaigns[i].purchasedCheck = true;
                break;
              }
            }
          }  
        }
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
