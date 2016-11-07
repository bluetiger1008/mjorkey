'use strict';

export default class InfoController {
	/*@ngInject*/
	constructor($stateParams, $state, campaignFactory, artistFactory, Auth, $uibModal, mainService) {
		this.campaignID = $stateParams.campaignID;
		this.campaignFactory = campaignFactory;
		this.artistFactory = artistFactory;
		this.getCurrentUser = Auth.getCurrentUserSync;
	    this.currentUser = this.getCurrentUser();
	    this.$state = $state;
	    this.$uibModal = $uibModal;
	    this.mainService = mainService;
	}

	$onInit() {
		// console.log(this.artistID);

	    this.campaignFactory.findCampaign(this.campaignID)
	      .then(response => {
	        // console.log(response.data);
	        this.campaign = response.data;
	        this.campaign.progress = Math.round(this.campaign.progress);

	        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
			var currentDate = new Date();
			var endsDate = new Date(this.campaign.ends_date);
			var remainingDays = Math.round(Math.abs((currentDate.getTime() - endsDate.getTime())/(oneDay)));
	        console.log(remainingDays);
	        
	        this.remainingDays = remainingDays;
	        this.artistFactory.findArtist(this.campaign.artistID)
	    	.then(response => {
	    		this.artist = response.data;
	    		console.log(this.artist);
	    	})
	      });
	}

	purchaseTicket() {
		console.log(this.currentUser);
		if(this.currentUser._id == '')
			this.subscribeFirstModal();
		else 
			this.$state.go('checkout', {campaignID: this.campaignID});
	}
	
	subscribeFirstModal() {
	    var modal = this.$uibModal.open({
	      animation: true,
	      template: require('../../modals/subscribeModal/subscribeModal.html'),
	      controller: function subscribeFirstController() {
	        var self=this;
	        self.closeModal = function(){
	          modal.close();
	        }
	      },
	      controllerAs: 'vm',
	      size: 'medium-st-custom'
	    });
	    this.mainService.set(modal);
	}
}