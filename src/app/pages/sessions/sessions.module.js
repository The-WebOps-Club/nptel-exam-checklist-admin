/**
 * @author shahidh
 * created on 16.04.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.sessions', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('sessions', {
          url: '/sessions',
          title: 'Sessions',
          templateUrl: 'app/pages/sessions/sessions.html',
          controller: 'SessionsPageCtrl',
          sidebarMeta: {
            icon: 'ion-briefcase',
            order: 0
          },
        });
  }

})();
