'use strict'

export default class CheckoutController {
	/*@ngInject*/
	constructor($stateParams, campaignFactory, $http, Auth, $uibModal, mainService) {
		// this.artistID = $stateParams.campaignID;
		// this.campaignFactory = campaignFactory;
		this.$http = $http;
    this.campaignID = $stateParams.campaignID;
		this.getCurrentUser = Auth.getCurrentUserSync;
    this.currentUser = this.getCurrentUser();
    this.$uibModal = $uibModal;
    this.mainService = mainService;
    this.campaignFactory = campaignFactory;
	}

	$onInit() {
    this.vipAdmissionCount = 0;
    this.generalAdmissionCount = 0;
    this.totalPrice = 0;
    this.customerCardFlag = false;
    console.log(this.currentUser._id);
    this.campaignFactory.findCampaign(this.campaignID)
      .then(response => {
        this.campaign = response.data;
    });

    if(this.currentUser.stripeId != null){
      this.customerCardFlag = true;

      this.$http.get('/api/charge/'+ this.currentUser.stripeId)
        .then(response => {
          console.log('stripe', response.data.sources.data);
          this.last_four = response.data.sources.data[0].last4;
          this.exp_month = response.data.sources.data[0].exp_month;
          this.exp_year = response.data.sources.data[0].exp_year;
      });
    }
    else
      this.customerCardFlag = false;
    console.log(this.customerCardFlag);
	}

	submit(){
		var token;
		var $httpAjax = this.$http;
		var currentUser = this.currentUser;
    var totalPrice = this.totalPrice;

		console.log(this.currentUser);
    if(this.currentUser._id == ''){
      this.subscribeFirstModal();
    } else if(this.cardNumber == null || this.cardExpMonth == null || this.cardExpYear == null || this.cardCvc == null) {
      this.subscribeFirstModal();
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
            userEmail: currentUser.email,
            totalPrice: totalPrice * 100
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

  getCardInfo() {


  }

  cardExistOption() {
    this.cardAdd= false;
  }

  cardAddOption() {
    this.cardAdd = true;
  }

  generalAdmissionPlus() {
    if(this.generalAdmissionCount <this.campaign.goals){
      this.generalAdmissionCount = this.generalAdmissionCount + 1;
      this.totalPrice += 20;
    }
  }

  generalAdmissionMinus() {
    if(this.vipAdmissionCount > 0){
      this.generalAdmissionCount = this.generalAdmissionCount - 1;
      this.totalPrice -= 20;
    }
  }

  vipAdmissionPlus() {
    if(this.vipAdmissionCount <this.campaign.goals){
      this.vipAdmissionCount = this.vipAdmissionCount + 1;
      this.totalPrice += 50;
    }

  }

  vipAdmissionMinus() {
    if(this.vipAdmissionCount >0){
      this.vipAdmissionCount = this.vipAdmissionCount -1;
      this.totalPrice -= 50;
    }

  }

}
