'use strict';

import angular from 'angular';
import ArtistController from './artist.controller';

export default angular.module('entusicApp.artist', [])
  .controller('ArtistController', ArtistController)
  .name;
