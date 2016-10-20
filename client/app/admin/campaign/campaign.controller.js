'use strict'

export default class CampaignController {

	/*@ngInject*/
	constructor($http, $scope, socket, Auth, campaignFactory, artistFactory) {
    	this.$http = $http;
	    this.socket = socket;
	    this.getCurrentUser = Auth.getCurrentUserSync;
	    this.currentUser = this.getCurrentUser();
	    console.log(this.getCurrentUser());

	    this.campaignFactory = campaignFactory;
	    this.artistFactory = artistFactory;

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
	    this.artistFactory.getArtists()
	    	.then(response => {
	    		this.artists = response.data;
	    	});
	    this.selectedArtistFlag = false;
	    this.successFlag = false;
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
	      	artistID: this.selectedArtistID,
	      	artistName: this.selectedArtistName,
	        city: this.campaign.city,
	        state: this.campaign.state,
	        description: this.campaign.description,
	        startedByUser: this.currentUser
	      }
	      this.campaignFactory.addCampaign(camp);
	      this.successFlag = true;
	      this.campaign.city = '';
	      this.campaign.state = '';
	      this.campaign.description = '';
	    }
	}

	deleteCampaign(campaign) {
	    this.$http.delete(`/api/campaigns/${campaign._id}`);
	    // this.getCampaigns();
	}

	selectArtist(artist) {
		this.selectedArtistID = artist._id;
		this.selectedArtistName = artist.name;
		this.selectedArtistFlag = true;
	}

	chooseArtist(){
		this.selectedArtistFlag = false;
	}
}