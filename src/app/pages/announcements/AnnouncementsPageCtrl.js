(function () {
  'use strict';

  angular.module('BlurAdmin.pages.announcements')
    .controller('AnnouncementsPageCtrl', AnnouncementsPageCtrl);

  /** @ngInject */
  function AnnouncementsPageCtrl($scope, $uibModal, hasura, editableOptions, editableThemes) {
    $scope.smartTablePageSize = 10;
    var arga = {
      table: 'nptel_announcement',
      columns: ['id', 'text'],
      order_by: '+id'
    };

    function getAnnouncements(){
      hasura.query('select', arga).then(function(data){
          $scope.original = data.slice();
          $scope.announcements = data.slice();
      }, function(error){
        console.log(error);
      })
    }
    getAnnouncements();

    $scope.addAnnouncement = function() {
      $scope.inserted = {
        id: 0,
        text: ''
      };
      $scope.announcements.push($scope.inserted);
    };

    $scope.removeAnnouncement = function(index) {
      $scope.announcements.splice(index, 1);
    };

    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

    $scope.$watch('announcements', function (newValue, oldValue, scope) {

      angular.forEach(newValue, function(announcement){
        if(announcement.id == 0){
            //new entry, post and refresh list
            var arga = {
              table: 'nptel_announcement',
              objects: [{
                text: announcement.text
              }],
              returning: ['id', 'text']
            }
            hasura.query('insert', arga).then(function(data){
              getAnnouncements();
            })
        } else {
          angular.forEach(oldValue, function(oannouncement){
            if (announcement.id == oannouncement.id) {
              if(!angular.equals(announcement, oannouncement)){
                console.log('oldwc', oannouncement);
                console.log('newwc', announcement);
                var arga = {
                  table: 'nptel_announcement',
                  where: {
                    id: announcement.id
                  },
                  $set: {
                    text: announcement.text
                  }
                }
                hasura.query('update', arga).then(function (data) {
                  getAnnouncements();
                })
              }
            }
          })
        }
      });
    }, true);

    $scope.initSave = function () {
    }
  }

})();
