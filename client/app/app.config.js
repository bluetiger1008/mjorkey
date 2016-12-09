'use strict';

export function routeConfig($urlRouterProvider, $locationProvider, $facebookProvider) {
  'ngInject';

  $urlRouterProvider.otherwise('/');
  
  $facebookProvider.setAppId('129273847558227');

  $locationProvider.html5Mode(true);

}
