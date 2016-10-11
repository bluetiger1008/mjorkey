'use strict'

export default class InfoController {
	/*@ngInject*/
	constructor($stateParams, campaignFactory) {
		this.artistID = $stateParams.campaignID;
		this.campaignFactory = campaignFactory;
	}

	$onInit() {
		console.log(this.artistID);
	    this.campaignFactory.findCampaign(this.artistID)
	      .then(response => {
	        // console.log(response.data);
	        this.campaign = response.data;
	        console.log(this.campaign);
	      });
	}
}