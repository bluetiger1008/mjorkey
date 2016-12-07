'use strict';

export default class SuccessController {
	/*@ngInject*/
	constructor($stateParams, $state, Auth, initService, $uibModal, $rootScope) {
		this.getCurrentUser = Auth.getCurrentUserSync;
	    this.currentUser = this.getCurrentUser();
	    this.$state = $state;
	    this.initService = initService;
	    this.$uibModal = $uibModal;
	    this.$rootScope = $rootScope;
	}

	$onInit() {
		this.$rootScope.onInfoPage = false;
		console.log(this.initService.purchasedTickets);
		this.purchasedTickets = this.initService.purchasedTickets;
		console.log(this.purchasedTickets);

		this.campaignUrl = this.initService.campaignUrl;
		console.log('url', this.campaignUrl);
		this.twitterUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.campaignUrl);
		this.facebookShareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(this.campaignUrl) + "&amp;src=sdkpreparse";
	}

	facebookShare() {
		FB.ui({
			method: 'share',
			display: 'popup',
			href: this.campaignUrl,
		});
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