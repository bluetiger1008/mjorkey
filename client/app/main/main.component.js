import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
      });

    this.$http.get('/api/artists')
      .then(response => {
        this.artists = response.data;
      });
  }

  addThing() {
    if(this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);

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

export default angular.module('majorkeyApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
