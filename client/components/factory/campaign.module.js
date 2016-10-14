'use strict';

import angular from 'angular';

export default angular.module('majorkeyApp.campaignFactory',[])
	.factory('campaignFactory', ['$http', function($http) {
		var urlBase = '/api/campaigns';
		var campaignFactory = {};

		campaignFactory.getCampaigns = function () {
			return $http.get(urlBase);
		};

		campaignFactory.addCampaign = function (camp) {
			return $http.post(urlBase, camp);
		};

		campaignFactory.deleteCampaign = function (id) {
			return $http.delete(urlBase + '/' + id);
		};

		campaignFactory.updateCampaign = function (camp) {
			return $http.put(urlBase + '/' + camp.ID, camp);
		};

		campaignFactory.findCampaign = function (id) {
			return $http.get(urlBase + '/' + id);
		}
		return campaignFactory;
	}])
	.name;
