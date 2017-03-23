'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('admin', {
    url: '/admin',
    template: require('./admin.html'),
    controller: 'AdminController',
    controllerAs: 'admin',
    authenticate: 'admin'
  })
  	.state('user', {
  		url: '/admin/user',
  		template: require('./user/user.html'),
  		controller: 'UserController',
  		controllerAs: 'admin',
      authenticate: 'admin'
  	})
  	.state('artist', {
  		url: '/admin/artist',
  		template: require('./artist/artist.html'),
  		controller: 'ArtistController',
  		controllerAs: 'admin',
      authenticate: 'admin'
  	})
    .state('campaignAdmin', {
      url: '/admin/campaign',
      template: require('./campaign/campaign.html'),
      controller: 'CampaignController',
      controllerAs: 'admin',
      authenticate: 'admin'
    })
    .state('campaignAdminInfo', {
      url: '/admin/campaign/:campaignID/',
      template: require('./campaign/info/info.html'),
      controller: 'CampaignAdminInfoController',
      controllerAs: 'admin',
      authenticate: 'admin'
    });
}
