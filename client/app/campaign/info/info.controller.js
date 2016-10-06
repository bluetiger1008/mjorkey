'use strict'

export default class InfoController {
	/*@ngInject*/
	constructor($scope, $stateParams) {
		$scope.artistID = $stateParams.campaignID;
		console.log($scope.artistID);
	}
}