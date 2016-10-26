'use strict';

export default class InfoController {
	/*@ngInject*/
	constructor($stateParams, campaignFactory, artistFactory, Auth) {
		this.campaignID = $stateParams.campaignID;
		this.campaignFactory = campaignFactory;
		this.artistFactory = artistFactory;
		this.getCurrentUser = Auth.getCurrentUserSync;
	    this.currentUser = this.getCurrentUser();
	}

	$onInit() {
		// console.log(this.artistID);
	    this.campaignFactory.findCampaign(this.campaignID)
	      .then(response => {
	        // console.log(response.data);
	        this.campaign = response.data;
	        console.log(this.campaign);
	        this.artistFactory.findArtist(this.campaign.artistID)
	    	.then(response => {
	    		this.artist = response.data;
	    		console.log(this.artist);
	    	})
	      });
	}

	purchaseTicket() {
		console.log(this.currentUser);
	}
}