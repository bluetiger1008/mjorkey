'use strict';

export default class SuccessController {
	/*@ngInject*/
	constructor($stateParams, $state, Auth, initService) {
		this.getCurrentUser = Auth.getCurrentUserSync;
	    this.currentUser = this.getCurrentUser();
	    this.$state = $state;
	    this.initService = initService;
	}

	$onInit() {
		console.log(this.initService.purchasedTickets);
		this.purchasedTickets = this.initService.purchasedTickets;
		console.log(this.purchasedTickets);
	}

	facebookShare() {
		
	}
}