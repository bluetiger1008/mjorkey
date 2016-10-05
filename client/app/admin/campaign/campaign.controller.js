'use strict'

export default class CampaignController {

	/*@ngInject*/
	constructor($http, $scope, socket) {
    	this.$http = $http;
	    this.socket = socket;
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
	    if(this.campaign) {
	      this.$http.post('/api/campaigns', {
	        artistName: this.campaign.artistName,
	        city: this.campaign.city,
	        state: this.campaign.state,
	        description: this.campaign.description
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