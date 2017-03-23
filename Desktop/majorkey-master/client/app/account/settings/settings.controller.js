'use strict';

export default class SettingsController {

  /*@ngInject*/
  constructor(Auth, $rootScope) {
    this.Auth = Auth;
    this.$rootScope = $rootScope;
  }

  $onInit() {
    this.$rootScope.onInfoPage = false;
  }
  
  changePassword(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }
}
