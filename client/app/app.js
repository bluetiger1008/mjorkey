'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import ngMaterial from 'angular-material';
import ngFileUpload from 'ng-file-upload';

import 'ng-Facebook';
import 'angular-socket-io';
import 'angularjs-datepicker';
import 'angulargrid';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';


import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import user from './admin/user';
import artist from './admin/artist';
import campaignAdmin from './admin/campaign';
import campaignAdminInfo from './admin/campaign/info';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import campaign from './campaign/campaign.component';
import campaignInfo from './campaign/info/';
import checkout from './campaign/checkout/';
import checkoutSuccess from './campaign/success';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import campaignFactory from '../components/factory/campaign.module';
import artistFactory from '../components/factory/artist.module';
import stripeFactory from '../components/factory/stripe.module';
import mainService from '../components/services/main_service.js';
import initService from '../components/services/init_service.js';

import './app.scss';

angular.module('majorkeyApp', [ngCookies, ngResource, ngSanitize, ngMaterial, 'ngFacebook', 'btford.socket-io', ngFileUpload, uiRouter, campaignFactory, artistFactory, stripeFactory,
    mainService, initService, uiBootstrap, '720kb.datepicker', 'angularGrid', _Auth, account, admin, user, artist, campaignAdmin, campaignAdminInfo, campaignInfo, checkout, checkoutSuccess, navbar, footer, campaign, constants, socket, util
  ])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;

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
