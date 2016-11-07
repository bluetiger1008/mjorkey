'use strict';

export default class CampaignAdminInfoController {
  /*@ngInject*/
  constructor($stateParams,campaignFactory, artistFactory, $uibModal, mainService) {
    this.campaignFactory = campaignFactory;
    this.artistFactory = artistFactory;
    this.campaignID = $stateParams.campaignID;
    this.$uibModal = $uibModal;
    this.mainService = mainService;
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

  campaignEditModal() {
    var self = this;
    var modal = this.$uibModal.open({
      animation: true,
      template: require('../../../modals/campaignEditModal/campaignEditModal.html'),
      controller: function campaignEditController() {
        console.log(self.campaign);
        this.campaign = self.campaign;
        this.closeModal = function(){
          modal.close();
        }
      },
      controllerAs: 'vm',
      size: 'medium-st-custom'
    });
    this.mainService.set(modal);
  }
  onEdit() {
    this.campaignEditModal();
  }
}
