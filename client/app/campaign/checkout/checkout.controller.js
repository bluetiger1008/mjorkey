'use strict'

export default class CheckoutController {
	/*@ngInject*/
	constructor($stateParams, campaignFactory, $http) {
		// this.artistID = $stateParams.campaignID;
		// this.campaignFactory = campaignFactory;
		this.$http = $http;
	}

	$onInit() {
	    // this.campaignFactory.findCampaign(this.artistID)
	    //   .then(response => {
	    //     // console.log(response.data);
	    //     this.campaign = response.data;
	    //     console.log(this.campaign);
	    //   });
	}

	submit(){
		this.$http.post('/api/stripe');	 
	}
}