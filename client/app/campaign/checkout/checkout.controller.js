'use strict'

export default class CheckoutController {
	/*@ngInject*/
	constructor($stateParams, campaignFactory, $http, Auth, $uibModal, mainService) {
		// this.artistID = $stateParams.campaignID;
		// this.campaignFactory = campaignFactory;
		this.$http = $http;
		this.getCurrentUser = Auth.getCurrentUserSync;
    this.currentUser = this.getCurrentUser();
    this.$uibModal = $uibModal;
    this.mainService = mainService;
	}

	$onInit() {
    this.vipAdmissionCount = 0;
    this.generalAdmissionCount = 0;
	}

	submit(){
		var token;
		var $httpAjax = this.$http;
		var currentUser = this.currentUser;

		console.log(this.currentUser);
    if(this.currentUser._id == ''){
      this.subscribeFirstModal();
    } else if(this.cardNumber == null || this.cardExpMonth == null || this.cardExpYear == null || this.cardCvc == null) {
      this.cardInputErrorModal();
    }
    else {
      Stripe.setPublishableKey('pk_test_YfBE0DEENw42WjJF0pq0KEkw');
      console.log(this.cardNumber, this.cardCvc, this.cardExpMonth, this.cardExpYear);
      Stripe.card.createToken({
        number: this.cardNumber,
        cvc: this.cardCvc,
        exp_month: this.cardExpMonth,
        exp_year: this.cardExpYear
      }, function (status, response) {
        if (response.error) {
          console.log(response.error.message);
        } else {
          token = response.id;
          console.log('token', token);
          $httpAjax.post('/api/charge', {
            token: token,
            userID: currentUser._id,
            userEmail: currentUser.email
          });
        }
      });
    }
	}

  subscribeFirstModal() {
    var modal = this.$uibModal.open({
      animation: true,
      template: require('../../modals/subscribeModal/subscribeModal.html'),
      controller: function subscribeFirstController() {
        var self=this;
        self.closeModal = function(){
          modal.close();
        }
      },
      controllerAs: 'vm',
      size: 'medium-st-custom'
    });
    this.mainService.set(modal);
  }

  cardInputErrorModal() {

  }

  cardExistOption() {
    this.cardAdd= false;
  }

  cardAddOption() {
    this.cardAdd = true;
  }

  generalAdmissionPlus() {
    if(this.generalAdmissionCount <6)
      this.generalAdmissionCount = this.generalAdmissionCount + 1;
  }

  generalAdmissionMinus() {
    if(this.vipAdmissionCount > 0)
      this.generalAdmissionCount = this.generalAdmissionCount - 1;
  }

  vipAdmissionPlus() {
    if(this.vipAdmissionCount <6)
      this.vipAdmissionCount = this.vipAdmissionCount + 1;
  }

  vipAdmissionMinus() {
    if(this.vipAdmissionCount >0)
      this.vipAdmissionCount = this.vipAdmissionCount -1;
  }

}
