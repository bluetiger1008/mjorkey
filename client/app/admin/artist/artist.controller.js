'use strict'

export default class ArtistController {

	/*@ngInject*/
	constructor($state, $http, Upload, $uibModal, mainService) {
		this.$state = $state;
		this.$http = $http;
		this.Upload = Upload;
    this.$uibModal = $uibModal;
    this.mainService = mainService;
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

  syncFormValid() {
    if(this.artist.name == '' || this.artist.name == null)
      this.artistNameRequired = true;
    else {
      this.artistNameRequired = false;
    }
    if(this.artist.email == '' || this.artist.email == null)
      this.artistEmailRequired = true;
    else {
      this.artist.EmailRequired = false;
    }
    if(this.artist.price == '' || this.artist.price == null)
      this.artistPriceRequired = true;
    else {
      this.artistPriceRequired = false;
    }
  }

	addArtist() {
    this.syncFormValid();
		if(!this.artistNameRequired && !this.artistEmailRequired && !this.artistPriceRequired) {
	    	this.$http.post('/api/artists', {
	        	name: this.artist.name,
	        	photo: this.photo,
	        	info: this.artist.info,
	        	email: this.artist.email,
            price: this.artist.price
	     	});

	      	this.artist.name = '';
	      	this.artist.info = '';
	      	this.artist.email = '';
          this.artist.price = '';
	      	this.photoName = '';
	      	this.photo = '';
	      	this.artist.photoName = 'abc';

	      	this.getArtists();
          this.file = null;
        this.result='success';
        this.notificationModal(this.result);
	    }
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

	submit() {
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
