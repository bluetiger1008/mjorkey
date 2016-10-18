'use strict'

export default class ArtistController {

	/*@ngInject*/
	constructor($state, $http, Upload) {
		this.$state = $state;
		this.$http = $http;
		this.Upload = Upload;
	}
	
	$onInit() {
		this.$http.get('/api/artists')
	      .then(response => {
	        this.artists = response.data;
	        console.log(response.data);
	      });
	}

	getArtists() {
	    this.$http.get('/api/artists')
	      .then(response => {
	        this.artists = response.data;
	    });	    
	}

	addArtist() {	
		if(this.artist) {
	    	this.$http.post('/api/artists', {
	        	name: this.artist.name,
	        	photo: this.photo,
	        	info: this.artist.info,
	        	email: this.artist.email,
	     	});

	      	this.artist.name = '';
	      	this.artist.info = '';
	      	this.artist.email = '';
	      	this.photoName = '';
	      	this.photo = '';
	      	this.artist.photoName = 'abc';
	      	this.getArtists();
	    }		    
	}

	deleteArtist(artist) {
	    this.$http.delete(`/api/artists/${artist._id}`);
	    this.getArtists();
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