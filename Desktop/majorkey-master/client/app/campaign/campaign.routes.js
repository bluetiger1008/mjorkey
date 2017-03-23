'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('campaign', {
    url: '/',
    template: '<campaign></campaign>',
  })
  .state('campaignInfo', {
  	url: '/campaign/:campaignID/',
  	template: require('./info/info.html'),
  	controller: 'InfoController',
  	controllerAs: 'vm',
  })
  .state('checkout', {
    url: '/campaign/checkout/:customerID/:campaignID/',
    template: require('./checkout/checkout.html'),
    controller: 'CheckoutController',
    controllerAs: 'vm',
    authenticate: true
  })
  .state('checkoutSuccess', {
    url: '/campaign/checkout/success',
    template: require('./success/success.html'),
    controller: 'SuccessController',
    controllerAs: 'vm',
    authenticate: true
  });
}
