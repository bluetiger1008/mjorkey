'use strict';

export default class LoginController {

  /*@ngInject*/
  constructor(Auth, $state, $uibModal, mainService, initService, $rootScope) {
    this.Auth = Auth;
    this.$state = $state;
    this.$uibModal = $uibModal;
    this.mainService = mainService;
    this.initService = initService;
    this.$rootScope = $rootScope;
  }

  $onInit() {
    this.$rootScope.onInfoPage = false;
  }

  login(form) {
    var self = this;
    this.submitted = true;

    if(form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          // Logged in, redirect to home
          var referrer = this.initService.currentPage.state || 'campaign';
          console.log(referrer);
          this.$state.go(referrer,{campaignID: this.initService.currentPage.id});
        })
        .catch(err => {
          self.submitNotificationModal("Failed", err.message);
          this.errors.login = err.message;
        });
    }
  }

  submitNotificationModal(status, message) {
    var msg = message;
    var status = status;
    var modal = this.$uibModal.open({
      animation: true,
      template: require('../../modals/errorModal/errorModal.html'),
      controller: function submitNotificationController() {
        var self=this;
        self.closeModal = function(){
          modal.close();
        }
        self.error = msg;
        self.status = status;
      },
      controllerAs: 'vm',
      size: 'medium-st-custom'
    });
    this.mainService.set(modal);
    this.submitLoading = false;
  }
}
