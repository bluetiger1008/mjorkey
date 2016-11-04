'use strict';

export default class CampaignAdminInfoController {
  /*@ngInject*/
  constructor($stateParams,campaignFactory, artistFactory) {
    this.campaignFactory = campaignFactory;
    this.artistFactory = artistFactory;
    this.campaignID = $stateParams.campaignID;

  }

  $onInit() {
  	this.campaignFactory.findCampaign(this.campaignID)
      .then(response => {
        this.campaign = response.data;
        this.artistFactory.findArtist(this.campaign.artistID)
          .then(response => {
            this.artist = response.data;
            console.log(this.artist);
          })

      });
  }
}
