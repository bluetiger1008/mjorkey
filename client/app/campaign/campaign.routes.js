'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('campaign', {
    url: '/campaign',
    template: '<campaign></campaign>',
  })
  .state('campaignInfo', {
  	url: '/campaign/:campaignID/',
  	template: require('./info/info.html'),
  	controller: 'InfoController',
  	controllerAs: 'vm',
  })
  .state('checkout', {
    url: '/campaign/checkout/:campaignID/',
    template: require('./checkout/checkout.html'),
    controller: 'CheckoutController',
    controllerAs: 'vm',
  });
}
