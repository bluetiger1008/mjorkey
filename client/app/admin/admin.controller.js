'use strict';
import angular from 'angular';

export default class AdminController {
	/*@ngInject*/
	constructor($stateParams, $state, Auth, initService, $uibModal, $rootScope) {
	    this.$rootScope = $rootScope;
	}

	$onInit() {
		this.$rootScope.onInfoPage = false;
	}
}
