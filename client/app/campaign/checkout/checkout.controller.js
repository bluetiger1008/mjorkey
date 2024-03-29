'use strict'

export default class CheckoutController {
	/*@ngInject*/
	constructor($stateParams, artistFactory, campaignFactory, stripeFactory , $http, Auth, $uibModal, mainService, initService, $state,  $rootScope) {
		this.$http = $http;
    this.$state = $state;
    this.campaignID = $stateParams.campaignID;
    this.customerID = $stateParams.customerID;
    this.Auth = Auth;
    this.$uibModal = $uibModal;
    this.mainService = mainService;
    this.initService = initService;
    this.campaignFactory = campaignFactory;
    this.stripeFactory = stripeFactory;
    this.artistFactory = artistFactory;
    this.buyTicket = false;
    this.$rootScope = $rootScope;
  }

	$onInit() {
    this.$rootScope.onInfoPage = false;
    this.vipAdmissionCount = 0;
    this.generalAdmissionCount = 0;
    this.temp_vipSold = 0;
    this.temp_generalSold = 0;
    this.totalPrice = 0;
    this.customerIdExisting = false;
    this.submitLoading = false;
    this.getCurrentUser = this.Auth.getCurrentUserSync;
    this.currentUser = this.getCurrentUser();

    this.campaignFactory.findCampaign(this.campaignID)
      .then(response => {
        this.campaign = response.data;
        this.temp_vipSold = this.campaign.vip_sold;
        this.temp_generalSold = this.campaign.general_sold;

        this.artistFactory.findArtist(this.campaign.artistID)
        .then(response => {
          this.artist = response.data;
          console.log(this.artist);
        })
      });
    
    // this.customerId = this.currentUser.stripeId;
    // Check customerID exisiting and get Cards if exist
    if(this.customerID != null){
      this.customerIdExisting = true;
      // this.customerId = this.currentUser.stripeId;
      console.log('customerID', this.customerID);

      this.$http.get('/api/charge/'+ this.currentUser.stripeId)
        .then(response => {
          console.log(response);
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
          name: this.cardName,
          number: this.cardNumber,
          cvc: this.cardCvc,
          exp_month: this.cardExpMonth,
          exp_year: this.cardExpYear
        }, function (status, response) {
          //Show error message if token has error
          if (response.error) {
            var errorMessage = response.error.message;
            console.log('error', errorMessage);
            if (errorMessage == 'You must supply either a card, customer, pii data, or bank account to create a token.')
              self.submitNotificationModal('Error','Please enter valid payment details to continue.');
            else 
              self.submitNotificationModal('Error',errorMessage);
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
                totalPrice: self.totalPrice,
                cardId: response.data.id
              }).then(response => {
                console.log('successfully');
                // self.submitNotificationModal('successfully purchased');
                self.initService.purchasedTickets = {
                  vip: self.vipAdmissionCount,
                  general: self.generalAdmissionCount,
                  totalPrice: self.totalPrice,
                  artistName: self.artist.name
                };
                self.$state.go('checkoutSuccess');
                self.calculateProgress();
                self.addPurchasingUser();
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
          totalPrice: this.totalPrice,
          cardId: this.cardId
        }).then(response => {
          console.log('successfully');
          // self.submitNotificationModal('successfully purchased');
          self.initService.purchasedTickets = {
            vip: self.vipAdmissionCount,
            general: self.generalAdmissionCount,
            totalPrice: self.totalPrice,
            artistName: self.artist.name
          };
          self.$state.go('checkoutSuccess');
          self.calculateProgress();
          self.addPurchasingUser();
          self.submitLoading = false;
          self.vipAdmissionCount = 0;
          self.generalAdmissionCount = 0;
          self.totalPrice = 0;
        })
      }
    } else {
      console.log('totalPrice is 0');
      self.submitNotificationModal('Error','Total price is $0, please confirm you bought ticket');
    }
	}

  calculateProgress() {
    this.campaign.current_goal = this.campaign.current_goal + this.totalPrice;
    this.progress = this.campaign.current_goal/this.campaign.goals * 100;
    this.vip_sold = this.vipAdmissionCount + this.temp_vipSold;
    this.general_sold = this.generalAdmissionCount + this.temp_generalSold;
    this.temp_vipSold = this.vip_sold;
    this.temp_generalSold = this.general_sold;

    this.campaignFactory.updateCampaign(this.campaign._id, {
      current_goal: this.campaign.current_goal,
      progress: this.progress,
      vip_sold: this.vip_sold,
      general_sold: this.general_sold
    });
  }

  //insert purchasing user in the campaign model
  addPurchasingUser() {
    console.log(this.campaign.purchased_users, this.currentUser);
    var same_count = false;
    for (var i=0; i<this.campaign.purchased_users.length; i++){
      if((this.campaign.purchased_users)[i] == this.currentUser._id){
        same_count = true;
        break;
      }
    }
    
    if(same_count == false){
      this.campaignFactory.updateCampaign(this.campaign._id, {
        $push: {
          purchased_users: this.currentUser
        }
      });
    }
  }

  submitNotificationModal(status, message) {
    var modal = this.$uibModal.open({
      animation: true,
      template: require('../../modals/errorModal/errorModal.html'),
      controller: function submitNotificationController() {
        var self=this;
        self.closeModal = function(){
          modal.close();
        }
        self.status = status;
        self.error = message;
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
    this.buyTicket = true;
    if(this.generalAdmissionCount <this.campaign.goals && this.generalAdmissionCount + this.vipAdmissionCount < 12){
      this.generalAdmissionCount = this.generalAdmissionCount + 1;
      this.totalPrice += this.campaign.general_price;
    }
  }

  generalAdmissionMinus() {
    if(this.generalAdmissionCount > 0){
      this.generalAdmissionCount = this.generalAdmissionCount - 1;
      this.totalPrice -= this.campaign.general_price;
    }
  }

  vipAdmissionPlus() {
    this.buyTicket = true;
    if(this.vipAdmissionCount <this.campaign.goals && this.generalAdmissionCount + this.vipAdmissionCount < 12){
      this.vipAdmissionCount = this.vipAdmissionCount + 1;
      this.totalPrice += this.campaign.vip_price;
    }
  }

  vipAdmissionMinus() {
    if(this.vipAdmissionCount >0){
      this.vipAdmissionCount = this.vipAdmissionCount -1;
      this.totalPrice -= this.campaign.vip_price;
    }
  }

}
