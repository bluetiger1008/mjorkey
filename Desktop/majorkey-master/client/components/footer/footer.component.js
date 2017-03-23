'use strict';
import angular from 'angular';

export class FooterComponent {
	
	constructor(initService) {
		'ngInject';
		this.showFooter = initService.onInfoPage;
		console.log('oninfo', initService.onInfoPage);
	}

}

export default angular.module('directives.footer', [])
  .component('footer', {
    template: require('./footer.html'),
    controller: FooterComponent
  })
  .name;
