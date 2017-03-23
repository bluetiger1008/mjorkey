'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: require('./login/login.html'),
    controller: 'LoginController',
    controllerAs: 'vm'
  })
    .state('logout', {
      url: '/logout?referrer',
      referrer: 'campaign',
      template: '<campaign></campaign>',
      controller($state, Auth, initService) {
        'ngInject';

        var referrer = $state.params.referrer || $state.current.referrer || 'campaign';
        console.log(referrer);
        Auth.logout();
        $state.go(referrer,{campaignID: initService.currentPage.id});
      }
    })
    .state('signup', {
      url: '/signup',
      template: require('./signup/signup.html'),
      controller: 'SignupController',
      controllerAs: 'vm'
    })
    .state('settings', {
      url: '/settings',
      template: require('./settings/settings.html'),
      controller: 'SettingsController',
      controllerAs: 'vm',
      authenticate: true
    });
}
