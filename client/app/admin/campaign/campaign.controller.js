'use strict'

export default class CampaignController {

	/*@ngInject*/
	constructor($http, $scope, socket, Auth, campaignFactory, artistFactory, $uibModal, mainService) {
    	this.$http = $http;
	    this.socket = socket;
	    this.$scope = $scope;
	    this.getCurrentUser = Auth.getCurrentUserSync;
	    this.currentUser = this.getCurrentUser();
	    this.campaignFactory = campaignFactory;
	    this.artistFactory = artistFactory;
      	this.$uibModal = $uibModal;
      	this.mainService = mainService;
      	this.campaignCityRequired = false;
      	this.campaignStateRequired = false;
      	this.campaignTicketsRequired = false;
      	this.campaign = [];
      	this.selectedArtist = [];
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
	    
	    this.tabSelect = 0;
	    this.goInput = false;
	    this.clean = {};
	}

	getCampaigns() {
	    this.$http.get('/api/campaigns')
	      	.then(response => {
	        	this.campaigns = response.data;
	      	});
	}

	submit() {
		this.$scope.form.$setUntouched();
		this.$scope.form.$submitted = true;
		if(this.$scope.form.$valid){
			var camp = {
		      	artistID: this.selectedArtist._id,
		      	artistName: this.selectedArtist.name,
		        city: this.campaign.city,
		        state: this.campaign.state,
		        description: this.campaign.description,
	      		goals: this.campaign.goals,
	      		vip_max: this.campaign.vip.max,
	      		vip_price: this.campaign.vip.price,
	      		general_price: this.campaign.general_price,
	      		ends_date: this.campaign.ends_date,
	      		startedByUser: this.currentUser
	      	};
	      	this.campaignFactory.addCampaign(camp);
	    	this.notificationModal('success');	

		}
      	
	}

	reset(form) {
		if (form) {
	      form.$setPristine();
	      form.$setUntouched();
	    }
	    this.campaign = angular.copy(this.clean);
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
		this.goInput = true;
		this.tabSelect = 1;
		this.selectedArtist = artist;
	}
}
