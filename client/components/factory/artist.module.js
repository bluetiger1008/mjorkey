'use strict';

import angular from 'angular';

export default angular.module('majorkeyApp.artistFactory',[])
	.factory('artistFactory', ['$http', function($http) {
		var urlBase = '/api/artists';
		var artistFactory = {};

		artistFactory.getArtists = function () {
			return $http.get(urlBase);
		};

		artistFactory.addArtist = function (camp) {
			return $http.post(urlBase, camp);
		};

		artistFactory.deleteArtist = function (id) {
			return $http.delete(urlBase + '/' + id);
		};

		artistFactory.updateArtist = function (camp) {
			return $http.put(urlBase + '/' + camp.ID, camp);
		};

		artistFactory.findArtist = function (id) {
			return $http.get(urlBase + '/' + id);
		}
		return artistFactory;
	}])
	.name;
