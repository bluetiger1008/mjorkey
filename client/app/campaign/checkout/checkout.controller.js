'use strict'

export default class CheckoutController {
	/*@ngInject*/
	constructor($stateParams, artistFactory, campaignFactory, stripeFactory , $http, Auth, $uibModal, mainService) {
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
    this.vipAdmissionCount = 0;
    this.generalAdmissionCount = 0;
    this.totalPrice = 0;
    this.customerIdExisting = false;
    this.submitLoading = false;

    this.campaignFactory.findCampaign(this.campaignID)
      .then(response => {
        this.campaign = response.data;
        
        this.artistFactory.findArtist(this.campaign.artistID)
        .then(response => {
          this.artist = response.data;
          console.log(this.artist);
        })
      });
    
    // Check customerID exisiting and get Cards if exist
    if(this.currentUser.stripeId != null){
      this.customerIdExisting = true;
      this.customerId = this.currentUser.stripeId;

      this.$http.get('/api/charge/'+ this.currentUser.stripeId)
        .then(response => {
          console.log('stripe', response.data.sources.data);
          this.creditCards = response.data.sources.data;      
      });
    }
    else
      this.customerIdExisting = false;
	}

	submit(){
		var token;
    
    this.submitLoading = true;
    var self = this;

    if(this.totalPrice > 0) {
      Stripe.setPublishableKey('pk_test_YfBE0DEENw42WjJF0pq0KEkw');

      //Adding New card when adding new card option selected
      if(this.addingNewCard == true) {
        Stripe.card.createToken({
          number: this.cardNumber,
          cvc: this.cardCvc,
          exp_month: this.cardExpMonth,
          exp_year: this.cardExpYear
        }, function (status, response) {
          //Show error message if token has error
          if (response.error) {
            var errorMessage = response.error.message;
            self.submitErrorModal(errorMessage);
            self.submitLoading = false;
          } else {
            token = response.id;
            console.log('stripe token is', token);
            
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
      }
      // Create charge when card option selected
      else {
        this.stripeFactory.createCharge({
          customerId: this.customerId,
          totalPrice: this.totalPrice,
          cardId: this.cardId
        }).then(response => {
          console.log('successfully');
          self.submitErrorModal('successfully purchased');
          self.submitLoading = false;
          self.vipAdmissionCount = 0;
          self.generalAdmissionCount = 0;
          self.totalPrice = 0;
        })
      }
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

  //set cardId when existing card selected
  setCardId(card) {
    this.addingNewCard= false;
    this.cardId = card.id;
  }

  //called when adding new card selected
  selectAddingNewOption() {
    this.addingNewCard = true;
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
