/**
 * @author shahidh
 * created on 16.04.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.centers', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('centers', {
          url: '/centers',
          title: 'Centers',
          templateUrl: 'app/pages/centers/centers.html',
          controller: 'CentersPageCtrl',
          sidebarMeta: {
            icon: 'ion-podium',
            order: 0
          },
        });
  }

})();
