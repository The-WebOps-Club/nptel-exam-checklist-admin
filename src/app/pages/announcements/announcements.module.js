/**
 * @author chinnichaitanya
 * created on 14.10.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.announcements', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('announcements', {
          url: '/announcements',
          title: 'Announcements',
          templateUrl: 'app/pages/announcements/announcements.html',
          controller: 'AnnouncementsPageCtrl',
          sidebarMeta: {
            icon: 'ion-alert-circled',
            order: 5
          },
        });
  }

})();
