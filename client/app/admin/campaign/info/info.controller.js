'use strict';

export default class CampaignAdminInfoController {
  /*@ngInject*/
  constructor($stateParams,campaignFactory) {
    this.campaignFactory = campaignFactory;
    this.campaignID = $stateParams.campaignID;
  }

  $onInit() {
  	this.campaignFactory.findCampaign(this.campaignID)
      .then(response => {
        // console.log(response.data);
        this.campaign = response.data;
 		console.log(this.campaign);
      });
  }
}
