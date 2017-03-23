'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: 'Campaigns',
    state: 'campaign'
  }];

  isCollapsed = true;

  constructor(Auth, $mdSidenav) {
    'ngInject';

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.$mdSidenav = $mdSidenav;
  }

  showNav(){
    this.$mdSidenav('left')
      .toggle()
      .then(function() {
        console.log('showing');
      });
  }

  navClose() {
    this.$mdSidenav('left').close();
  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
