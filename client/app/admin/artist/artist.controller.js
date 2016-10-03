'use strict'

import angular from 'angular';

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
		if(this.newArtist) {
	    	this.$http.post('/api/artists', {
	        	name: this.newArtist
	     	});
	      	this.newThing = '';
	      	this.getArtists();
	    }
	}

	deleteArtist(artist) {
	    this.$http.delete(`/api/artists/${artist._id}`);
	    this.getArtists();
	}	
}