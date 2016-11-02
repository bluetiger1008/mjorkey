'use strict'

export default class CampaignController {

	/*@ngInject*/
	constructor($http, $scope, socket, Auth, campaignFactory, artistFactory, $uibModal, mainService) {
    	this.$http = $http;
	    this.socket = socket;
	    this.getCurrentUser = Auth.getCurrentUserSync;
	    this.currentUser = this.getCurrentUser();
	    console.log(this.getCurrentUser());

	    this.campaignFactory = campaignFactory;
	    this.artistFactory = artistFactory;
      this.$uibModal = $uibModal;
      this.mainService = mainService;

      this.campaignCityRequired = false;
      this.campaignStateRequired = false;
      this.campaignTicketsRequired = false;

      this.campaign = [];

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
	    this.createCampaignClicked = false;
	    this.viewCampaignClicked = false;
	}

  syncFormValid() {
    if(this.campaign.city == '' || this.campaign.city == null)
      this.campaignCityRequired = true;
    else {
      this.campaignCityRequired = false;
    }
    if(this.campaign.state == '' || this.campaign.state == null)
      this.campaignStateRequired = true;
    else {
      this.campaignStateRequired = false;
    }
    if(this.campaign.goals == '' || this.campaign.goals == null)
      this.campaignTicketsRequired = true;
    else {
      this.campaignTicketsRequired = false;
    }
  }

	getCampaigns() {
	    this.$http.get('/api/campaigns')
	      .then(response => {
	        this.campaigns = response.data;
	      });
	}

	addCampaign() {
    	this.syncFormValid();
		console.log(this.currentUser);
	    if(!this.campaignCityRequired && !this.campaignStateRequired && !this.campaignTicketsRequired) {

	      	var camp = {
		      	artistID: this.selectedArtistID,
		      	artistName: this.selectedArtistName,
		        city: this.campaign.city,
		        state: this.campaign.state,
		        description: this.campaign.description,
          		goals: this.campaign.goals,
          		vip_price: this.campaign.vip_price,
          		general_price: this.campaign.general_price,
	      		startedByUser: this.currentUser
	      	}	
	      	this.campaignFactory.addCampaign(camp);
	      	this.successFlag = true;
	      	this.campaign.city = '';
	      	this.campaign.state = '';
	      	this.campaign.description = '';
        	this.campaign.goals = '';
        	this.campaign.vip_price = '';
        	this.campaign.general_price = '';
        	this.result = 'success';
        	this.notificationModal(this.result);
	    }
	}

  notificationModal(notification) {
    var modal = this.$uibModal.open({
      animation: true,
      template: require('../../modals/NotificationModal/notificationModal.html'),
      controller: function notificationController() {
        var self=this;
        self.closeModal = function(){
          modal.close();
        }
        self.modalfor = 'Campaign';
        if(notification == 'success')
          self.success = true;
        else
          self.success = false;
      },
      controllerAs: 'vm',
      size: 'medium-st-custom'
    });
    this.mainService.set(modal);
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
	    this.campaignCityRequired = false;
	    this.campaignStateRequired = false;
	    this.campaignTicketsRequired = false;
	    this.campaign.city = '';
	    this.campaign.state = '';
	    this.campaign.description = '';
	    this.campaign.goals = '';
	}

	createNewCampaign() {
		this.createCampaignClicked = true;
	}

	cancelCampaignCreate() {
		this.createCampaignClicked = false;	
	}

	viewCampaignList() {
		this.viewCampaignClicked = true;
	}

	cancelCampaignList() {
		this.viewCampaignClicked = false;	
	}
}
