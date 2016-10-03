'use strict'

export default class ArtistController {

	/*@ngInject*/
	constructor($state, $http) {
		this.$state = $state;
		this.$http = $http;
		this._onInit();
	}

	_onInit() {
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
	        	info: this.artist.info,
	        	email: this.artist.email
	     	});

	      	this.artist.name = '';
	      	this.artist.info = '';
	      	this.artist.email = '';
	      	this.getArtists();
	    }
	}

	deleteArtist(artist) {
	    this.$http.delete(`/api/artists/${artist._id}`);
	    this.getArtists();
	}	
}