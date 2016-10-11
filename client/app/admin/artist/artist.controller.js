'use strict'

export default class ArtistController {

	/*@ngInject*/
	constructor($state, $http, FileUploader) {
		this.$state = $state;
		this.$http = $http;
		// this.FileUploader = FileUploader;
		// this.uploader = new FileUploader({
	 //      url: 'api/users/logo',
	 //      alias: 'newLogo',
	 //      onAfterAddingFile: onAfterAddingFile,
	 //      onSuccessItem: onSuccessItem,
	 //      onErrorItem: onErrorItem
	 //    });
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
	        	info: this.artist.info,
	        	email: this.artist.email
	     	});

	      	this.artist.name = '';
	      	this.artist.info = '';
	      	this.artist.email = '';
	      	
	    }
	    this.getArtists();
	}

	deleteArtist(artist) {
	    this.$http.delete(`/api/artists/${artist._id}`);
	    this.getArtists();
	}

	// Create file uploader instance
    

    // Set file uploader img filter
 //    this.uploader.filters.push({
 //      name: 'logoFilter',
 //      fn: function (item, options) {
 //        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
 //        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
 //      }
 //    });

 //    // Called after the user selected a new img file
 //    onAfterAddingFile(fileItem) {
 //      if ($window.FileReader) {
 //        var fileReader = new FileReader();
 //        fileReader.readAsDataURL(fileItem._file);

 //        fileReader.onload = function (fileReaderEvent) {
 //          $timeout(function () {
 //            this.artist.imgURL = fileReaderEvent.target.result;
 //          }, 0);
 //        };
 //      }
 //    }

	// // Called after the user has successfully uploaded a new logo
 //    onSuccessItem(fileItem, response, status, headers) {
 //      // Show success message
 //      this.success = true;

 //      // Populate user object
 //      this.user = Authentication.user = response;

 //      // Clear upload buttons
 //      cancelUpload();
 //    }

	// // Change user profile picture
	// uploadImg() {
	// 	// Clear messages
	//     this.success = this.error = null;
	//     // Start upload
	//     this.uploader.uploadAll();
	// }

	// // Cancel the upload process
	// cancelUpload() {
 //      this.uploader.clearQueue();
 //      this.imgUrl = this.artist.imgURL;
 //    }

 //    // Called after the user has failed to uploaded a new picture
 //    onErrorItem(fileItem, response, status, headers) {
 //      // Clear upload buttons
 //      cancelUpload();

 //      // Show error message
 //      this.error = response.message;
 //    }
}