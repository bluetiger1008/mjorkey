'use strict'

export default class CampaignController {

	/*@ngInject*/
	constructor($http, $scope, socket, Auth, campaignFactory) {
    	this.$http = $http;
	    this.socket = socket;
	    this.getCurrentUser = Auth.getCurrentUserSync;
	    this.currentUser = this.getCurrentUser();
	    console.log(this.getCurrentUser());

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
	    this.$http.get('/api/artists')
	      .then(response => {
	        this.artists = response.data;
	    });
	}

	getCampaigns() {
	    this.$http.get('/api/campaigns')
	      .then(response => {
	        this.campaigns = response.data;
	      });
	}

	addCampaign() {
		console.log(this.currentUser);
	    if(this.campaign) {
	      
	      var camp = {
	      	artistName: this.campaign.artistName,
	        city: this.campaign.city,
	        state: this.campaign.state,
	        description: this.campaign.description,
	        startedByUser: this.currentUser
	      }
	      this.campaignFactory.addCampaign(camp); 
	      this.campaign.artistName = '';
	      this.campaign.city = '';
	      this.campaign.state = '';
	      this.campaign.description = '';
	    }

	      
	    
	}

	deleteCampaign(campaign) {
	    this.$http.delete(`/api/campaigns/${campaign._id}`);
	    // this.getCampaigns();
	}	
}