/**
 * @author shahidh
 * created on 16.04.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('users', {
          url: '/users',
          title: 'Users',
          templateUrl: 'app/pages/users/users.html',
          controller: 'UsersPageCtrl',
          sidebarMeta: {
            icon: 'ion-person',
            order: 0
          },
        });
  }

})();
