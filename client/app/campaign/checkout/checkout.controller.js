'use strict'

export default class CheckoutController {
	/*@ngInject*/
	constructor($stateParams, campaignFactory, stripeFactory , $http, Auth, $uibModal, mainService) {
		// this.artistID = $stateParams.campaignID;
		// this.campaignFactory = campaignFactory;
		this.$http = $http;
    this.campaignID = $stateParams.campaignID;
		this.getCurrentUser = Auth.getCurrentUserSync;
    this.currentUser = this.getCurrentUser();
    this.$uibModal = $uibModal;
    this.mainService = mainService;
    this.campaignFactory = campaignFactory;
    this.stripeFactory = stripeFactory;
	}

	$onInit() {
    this.errorMessage = '';
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
    var stripeFactory = this.stripeFactory;
    var customerId = this.currentUser.stripeId;
    var uibModal = this.$uibModal;
    var mainService = this.mainService;

    if(this.totalPrice > 0) {
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
          var errorMessage = response.error.message;
          var modal = uibModal.open({
            animation: true,
            template: require('../../modals/errorModal/errorModal.html'),
            controller: function submitErrorController() {
              var self=this;
              self.closeModal = function(){
                modal.close();
              }
              self.error = errorMessage;
            },
            controllerAs: 'vm',
            size: 'medium-st-custom'
          });
          mainService.set(modal);
        } else {
          token = response.id;
          console.log('token', token);
          stripeFactory.createCard({
            token: token,
            customerId: customerId
          }).then(response => {
            console.log(response.data.id);
            stripeFactory.createCharge({
              customerId: customerId,
              totalPrice: totalPrice,
              cardId: response.data.id
            })
          });
        }
      });  
    } else {
      this.totalPriceErrorModal();
    }
	}

  totalPriceErrorModal() {
    var modal = this.$uibModal.open({
      animation: true,
      template: require('../../modals/errorModal/errorModal.html'),
      controller: function submitErrorController() {
        var self=this;
        self.closeModal = function(){
          modal.close();
        }
        self.error = 'TotalPrice is $0, Please confirm your ticket purchasing status';
      },
      controllerAs: 'vm',
      size: 'medium-st-custom'
    });
    this.mainService.set(modal);
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
