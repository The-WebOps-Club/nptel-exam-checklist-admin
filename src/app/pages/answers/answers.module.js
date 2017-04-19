/**
 * @author shahidh
 * created on 16.04.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.answers', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('answers', {
          url: '/answers',
          title: 'Answers',
          templateUrl: 'app/pages/answers/answers.html',
          controller: 'AnswersPageCtrl',
          sidebarMeta: {
            icon: 'ion-checkmark',
            order: 0
          },
        });
  }

})();
