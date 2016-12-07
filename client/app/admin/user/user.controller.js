'use strict';

export default class UserController {
  /*@ngInject*/
  constructor(User, $rootScope) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.$rootScope = $rootScope;
  }

  $onInit() {
  	this.$rootScope.onInfoPage = false;
  }
  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}
