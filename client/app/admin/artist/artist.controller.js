'use strict'

export default class ArtistController {

	/*@ngInject*/
	constructor($state, $http, Upload, $uibModal, mainService, $scope, artistFactory) {
		this.$state = $state;
		this.$http = $http;
		this.Upload = Upload;
    this.$uibModal = $uibModal;
    this.mainService = mainService;
    this.$scope = $scope;
    this.artistFactory = artistFactory;
    this.clean = {};
	}

	$onInit() {
		this.$http.get('/api/artists')
	      .then(response => {
	        this.artists = response.data;
	        console.log(response.data);
	      });

    this.artistNameRequired = false;
    this.artistEmailRequired = false;
    this.artistPriceRequired = false;
    this.artist = [];
	}

	getArtists() {
	    this.$http.get('/api/artists')
	      .then(response => {
	        this.artists = response.data;
	    });
	}

  submit() {
    this.$scope.form.$setUntouched();
    this.$scope.form.$submitted = true;
    if(this.$scope.form.$valid){
      var artist = {
        name: this.artist.name,
        photo: this.photo,
        info: this.artist.info,
        email: this.artist.email,
        price: this.artist.price
      };
      this.photoName = '';
      this.photo = '';
      this.artist.photoName = '';
      this.file = null;
      this.artistFactory.addArtist(artist);
      this.notificationModal('success');
      this.getArtists();
      this.reset(this.$scope.form);
    }   
  }

  reset(form) {
    if (form) {
      form.$setPristine();
      form.$setUntouched();
    }
    this.artist = angular.copy(this.clean);
  }
	
	deleteArtist(artist) {
	    this.$http.delete(`/api/artists/${artist._id}`);
	    this.getArtists();
	}

  notificationModal(notification) {
    var modal = this.$uibModal.open({
      animation: true,
      template: require('../../modals/NotificationModal/notificationModal.html'),
      controller: function notificationController() {
        var self=this;
        self.closeModal = function(){
          modal.close();
        }
        self.modalfor = 'Artist';
        if(notification == 'success')
          self.success = true;
        else
          self.success = false;
      },
      controllerAs: 'vm',
      size: 'medium-st-custom'
    });
    this.mainService.set(modal);
  }

	submitPhoto() {
  	console.log('submit');
  	if (this.file) {
    	this.upload(this.file);
  	}
  }

  upload(file) {
  	console.log('upload');
  	if(file){
  		this.Upload.upload({
            url: 'api/artists/photo',
            data: {newPhoto: file}
        }).then(resp => {
            console.log('Success ' + resp.config.data.newPhoto.name + 'uploaded. Response: ' + resp.data);
            this.photo = resp.data;
            this.photoName = resp.config.data.newPhoto.name;
        }, resp =>{
            console.log('Error status: ' + resp.status);
        }, evt => {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.newPhoto.name);
        });
        // console.log(this.photo);

  	}

  }
}
