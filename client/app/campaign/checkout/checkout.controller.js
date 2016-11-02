'use strict'

export default class CheckoutController {
	/*@ngInject*/
	constructor($stateParams, artistFactory, campaignFactory, stripeFactory , $http, Auth, $uibModal, mainService) {
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
    this.artistFactory = artistFactory;
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
        this.artistFactory.findArtist(this.campaign.artistID)
        .then(response => {
          this.artist = response.data;
          console.log(this.artist);
        })
      });

    this.submitLoading = false;

    if(this.currentUser.stripeId != null){
      this.customerCardFlag = true;

      this.$http.get('/api/charge/'+ this.currentUser.stripeId)
        .then(response => {
          console.log('stripe', response.data.sources.data);
          this.creditCards = response.data.sources.data;
          // this.last_four = response.data.sources.data[0].last4;
          // this.exp_month = response.data.sources.data[0].exp_month;
          // this.exp_year = response.data.sources.data[0].exp_year;
      });
    }
    else
      this.customerCardFlag = false;
    console.log(this.customerCardFlag);
	}

	submit(){
		var token;
    
    this.submitLoading = true;
    var self = this;

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
          self.submitErrorModal(errorMessage);
          self.submitLoading = false;
        } else {
          token = response.id;
          console.log('token', token);
          self.stripeFactory.createCard({
            token: token,
            customerId: self.customerId
          }).then(response => {
            console.log(response.data.id);
            self.stripeFactory.createCharge({
              customerId: self.customerId,
              totalPrice: self.totalPrice,
              cardId: response.data.id
            }).then(response => {
              console.log('successfully');
              self.submitErrorModal('successfully purchased');
              self.submitLoading = false;
              self.vipAdmissionCount = 0;
              self.generalAdmissionCount = 0;
              self.totalPrice = 0;
            })
          });
        }
      });  
    } else {
      self.submitErrorModal('Total price is $0, please confirm you bought ticket');
    }
	}

  submitErrorModal(message) {
    var msg = message;
    var modal = this.$uibModal.open({
      animation: true,
      template: require('../../modals/errorModal/errorModal.html'),
      controller: function submitErrorController() {
        var self=this;
        self.closeModal = function(){
          modal.close();
        }
        self.error = msg;
      },
      controllerAs: 'vm',
      size: 'medium-st-custom'
    });
    this.mainService.set(modal);
    this.submitLoading = false;
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
