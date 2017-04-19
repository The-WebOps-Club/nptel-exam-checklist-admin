/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',

    'BlurAdmin.pages.questions',
    'BlurAdmin.pages.answers',
    'BlurAdmin.pages.centers',
    'BlurAdmin.pages.sessions',
    'BlurAdmin.pages.users'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/questions');
  }

})();
