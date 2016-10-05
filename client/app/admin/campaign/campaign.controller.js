'use strict'

export default class CampaignController {

	/*@ngInject*/
	constructor($http, $scope, socket, Auth) {
		'ngInject';

    	this.$http = $http;
	    this.socket = socket;
	    this.getCurrentUser = Auth.getCurrentUserSync;
	    this.currentUser = this.getCurrentUser();
	    console.log(this.getCurrentUser());
	 }

	$onInit() {
	    this.$http.get('/api/campaigns')
	      .then(response => {
	        this.campaigns = response.data;
	        this.socket.syncUpdates('campaign', this.campaigns);
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
	      this.$http.post('/api/campaigns', {
	        artistName: this.campaign.artistName,
	        city: this.campaign.city,
	        state: this.campaign.state,
	        description: this.campaign.description,
	        startedByUser: this.currentUser
	      });
	      this.campaign.artistName = '';
	      this.campaign.city = '';
	      this.campaign.state = '';
	      this.campaign.description = '';
	      // this.getCampaigns();
	    }
	}

	deleteCampaign(campaign) {
	    this.$http.delete(`/api/campaigns/${campaign._id}`);
	    // this.getCampaigns();
	}	
}