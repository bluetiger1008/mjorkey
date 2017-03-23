'use strict';

import angular from 'angular';

export default angular.module('majorkeyApp.stripeFactory',[])
  .factory('stripeFactory', ['$http', function($http) {
    var urlBase = '/api/charge';
    var stripeFactory = {};

    stripeFactory.createCustomer = function(camp) {
      return $http.post(urlBase + '/createCustomer', camp);
    }

    stripeFactory.createCard = function(camp) {
      return $http.post(urlBase + '/createCard', camp);
    }

    stripeFactory.createCharge = function(camp) {
      return $http.post(urlBase + '/createCharge', camp);
    }

    stripeFactory.getCard = function () {
      return $http.get(urlBase + '/' + id);
    };

    return stripeFactory;
  }])
  .name;
