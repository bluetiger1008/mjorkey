'use strict';

import angular from 'angular';

export default class SignupController {

  /*@ngInject*/
  constructor(Auth, $state, stripeFactory, $rootScope) {
    this.Auth = Auth;
    this.$state = $state;
    this.stripeFactory = stripeFactory;
    this.$rootScope = $rootScope;
  }

  $onInit() {
    this.$rootScope.onInfoPage = false;
  }
  
  register(form) {
    this.submitted = true;
    var stripeFactory = this.stripeFactory;

    if(form.$valid) {
      return this.Auth.createUser({
        name: this.user.name,
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          this.$state.go('campaign');
        })
        .catch(err => {
          err = err.data;
          this.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
    }
  }
}
