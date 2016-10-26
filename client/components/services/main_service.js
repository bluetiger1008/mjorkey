'use strict';

import angular from 'angular';

export default angular.module('majorkeyApp.mainService', [])
  .service('mainService',function(){
    var instance = {};

    return {
      get: function() {
        return instance;
      },
      set: function(value) {
        instance = value;
      }
    };
  })
  .name;
