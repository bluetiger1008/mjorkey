'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('campaign', {
    url: '/campaign',
    template: '<campaign></campaign>'
  })
  .state('campaignInfo', {
  	url: '/campaign/:campaignID/',
  	template: require('./info/info.html'),
  	controller: 'InfoController',
  	controllerAS: 'vm'
  });
}
