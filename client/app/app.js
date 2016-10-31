'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import ngFileUpload from 'ng-file-upload';

import 'angular-socket-io';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import angularFileUpload from 'angular-file-upload';
// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';


import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import user from './admin/user';
import artist from './admin/artist';
import campaignAdmin from './admin/campaign';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import campaign from './campaign/campaign.component';
import campaignInfo from './campaign/info/';
import checkout from './campaign/checkout/';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import campaignFactory from '../components/factory/campaign.module';
import artistFactory from '../components/factory/artist.module';
import stripeFactory from '../components/factory/stripe.module';
import mainService from '../components/services/main_service.js';

import './app.scss';

angular.module('majorkeyApp', [ngCookies, ngResource, ngSanitize, 'btford.socket-io', ngFileUpload, uiRouter, campaignFactory, artistFactory, stripeFactory,
    mainService, uiBootstrap, _Auth, account, admin, user, artist, campaignAdmin, campaignInfo, checkout, navbar, footer, main, campaign, constants, socket, util
  ])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });

  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['majorkeyApp'], {
      strictDi: true
    });
  });
