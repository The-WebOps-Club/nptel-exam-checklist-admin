'use strict';

angular.module('BlurAdmin', [
  'ngAnimate',
  'ui.bootstrap',
  'ui.sortable',
  'ui.router',
  'ngTouch',
  'toastr',
  'smart-table',
  "xeditable",
  'ui.slimscroll',
  'ngJsTree',
  'angular-progress-button-styles',
  'angular-loading-bar',

  'BlurAdmin.theme',
  'BlurAdmin.pages'
])
.config(function($httpProvider){
  $httpProvider.defaults.withCredentials = true;
})
.run([
    '$state', 'hasura', '$window', function($state, hasura, $window) {
        hasura.isSignedIn().then(function(data){
          console.log('Logged in', data);
        }).catch(function(error){
            $window.location.href = '/auth.html';
        });
    }
  ]);
