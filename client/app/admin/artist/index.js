'use strict';

import angular from 'angular';
import ArtistController from './artist.controller';

export default angular.module('majorkeyApp.artist', [])
  .controller('ArtistController', ArtistController)
  .name;
