/**
 * @author shahidh
 * created on 16.04.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.questions', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('questions', {
          url: '/questions',
          title: 'Questions',
          templateUrl: 'app/pages/questions/questions.html',
          controller: 'QuestionsPageCtrl',
          sidebarMeta: {
            icon: 'ion-help',
            order: 0
          },
        });
  }

})();
