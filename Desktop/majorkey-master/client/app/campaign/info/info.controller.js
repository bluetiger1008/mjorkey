'use strict';

export default class InfoController {
	/*@ngInject*/
	constructor($http, $stateParams, $state, $interval, campaignFactory, artistFactory, Auth, $uibModal, mainService, initService, $rootScope) {
		this.campaignID = $stateParams.campaignID;
		this.campaignFactory = campaignFactory;
		this.artistFactory = artistFactory;
		this.getCurrentUser = Auth.getCurrentUserSync;
	    this.currentUser = this.getCurrentUser();
	    this.$state = $state;
	    this.$uibModal = $uibModal;
	    this.mainService = mainService;
	    this.initService = initService;
	    this.$rootScope = $rootScope;
	    this.$http = $http;
	    this.$interval = $interval;
	}

	$onInit() {
		var self = this;
		
		this.$rootScope.onInfoPage = true;		
		this.initService.onInfoPage = true;
		this.initService.currentPage = {
			state: 'campaignInfo',
			id: this.campaignID
		};		

	    this.campaignFactory.findCampaign(this.campaignID)
	      .then(response => {
	        // console.log(response.data);
	        this.campaign = response.data;
	        this.campaign.progress = Math.round(this.campaign.progress);

	        if(this.campaign.progress >= 100)
	        	this.campaign.percentage = 100;
	        else if(this.campaign.progress<2)
	        	this.campaign.percentage = 0;
	        else
		        this.campaign.percentage = this.campaign.progress;
	
			var self = this;
	        var remainingDays, remainingHours, remainingMins;
	        this.$interval(function(){
				var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
				var currentDate = new Date();
				var endsDate = new Date(self.campaign.ends_date);
				var delta = Math.abs(endsDate.getTime() - currentDate.getTime()) / 1000;
				remainingDays = Math.round(Math.abs((currentDate.getTime() - endsDate.getTime())/(oneDay)));
				remainingHours = 24 - Math.floor(delta / 3600) % 24;
				remainingMins = 60 - Math.floor(delta / 60) % 60;
		    	self.remainingDays = remainingDays;
		        self.remainingHours = remainingHours;
		        self.remainingMins = remainingMins;    
		        
	        }, 5000);

	        

			var current_campaignUrl = window.location.href;
		    console.log(current_campaignUrl);

		    this.$http.post('/api/shorten', {
		      url: current_campaignUrl
		    }).then(function(response){
		      console.log('encode', response.data.shortUrl);
		      self.current_campaignUrl = response.data.shortUrl;
		      self.twitterUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(self.current_campaignUrl);
		    });

	        this.artistFactory.findArtist(this.campaign.artistID)
	    	.then(response => {
	    		this.artist = response.data;
	    		console.log(this.artist);
	    	})
	      });
	}

	calcRemaining() {
		console.log(this.campaign.ends_date);
		var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
		var currentDate = new Date();
		var endsDate = new Date(this.campaign.ends_date);
		var delta = Math.abs(endsDate.getTime() - currentDate.getTime()) / 1000;
		var remainingDays = Math.round(Math.abs((currentDate.getTime() - endsDate.getTime())/(oneDay)));
		var remainingHours = Math.floor(delta / 3600) % 24;
		var remainingMins = Math.floor(delta / 60) % 60;
        
        this.remainingDays = remainingDays;
        this.remainingHours = remainingHours;
        this.remainingMins = remainingMins;
	}

	facebookShare() {
		FB.ui({
			method: 'share',
			display: 'popup',
			href: this.current_campaignUrl,
		});
	}
	
	purchaseTicket() {
		console.log(this.currentUser);
		if(this.currentUser._id == '')
			this.subscribeFirstModal();
		else {
			this.initService.campaignUrl = this.current_campaignUrl;
			this.$state.go('checkout', {customerID:this.currentUser.stripeId, campaignID: this.campaignID});
		}
	}
	
	subscribeFirstModal() {
		var self = this;
	    var modal = this.$uibModal.open({
	      animation: true,
	      template: require('../../modals/subscribeModal/subscribeModal.html'),
	      controller: function subscribeFirstController() {        
	        this.close_modal = function() {
	        	modal.close();
	        }
	        this.signup = function() {
	        	self.$state.go('signup');
	        	this.close_modal();
	        }
	        this.login = function() {
	        	self.$state.go('login');
	        	this.close_modal();
	        }
	      },
	      controllerAs: 'vm',
	      size: 'medium-st-custom'
	    });
	    this.mainService.set(modal);
	}
}