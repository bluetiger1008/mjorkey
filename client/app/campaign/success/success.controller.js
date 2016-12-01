'use strict';

export default class SuccessController {
	/*@ngInject*/
	constructor($stateParams, $state, Auth, initService, $uibModal) {
		this.getCurrentUser = Auth.getCurrentUserSync;
	    this.currentUser = this.getCurrentUser();
	    this.$state = $state;
	    this.initService = initService;
	    this.$uibModal = $uibModal;
	}

	$onInit() {
		console.log(this.initService.purchasedTickets);
		this.purchasedTickets = this.initService.purchasedTickets;
		console.log(this.purchasedTickets);

		this.campaignUrl = this.initService.campaignUrl;
		console.log('url', this.campaignUrl);
		this.twitterUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.campaignUrl);
	}

	facebookShare() {
		
	}

	copylink() {
		var self = this;
		var modal = this.$uibModal.open({
	      animation: true,
	      template: require('../../modals/errorModal/errorModal.html'),
	      controller: function submitNotificationController() {
	        
	        this.closeModal = function(){
	          modal.close();
	        }
	        this.status = 'Copy link';
	        this.error = self.campaignUrl;
	      },
	      controllerAs: 'vm',
	      size: 'medium-st-custom'
	    });
	    this.mainService.set(modal);
	}
}