(function () {
  'use strict';

  angular.module('BlurAdmin.pages.centers')
    .controller('CentersPageCtrl', CentersPageCtrl);

  /** @ngInject */
  function CentersPageCtrl($scope, $uibModal, hasura) {
    function getCenters(){
      var argq = {
        table: 'nptel_center',
        columns: ['id', 'name', 'state', {'name':'allotted_user', 'columns':['id', 'name', 'email']}]
      }
      hasura.query('select', argq).then(function(data){
        $scope.centers = data;
      })
    }
    getCenters();
    var users = [];
    function getUsers(){
      var argq = {
        table: 'nptel_user',
        columns: ['id', 'name', 'email']
      }
      hasura.query('select', argq).then(function(data){
        users = data;
      })
    }
    getUsers();

    $scope.openModal = function (item) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/centers/centerModal.html',
        size: 'md',
        controller: function($scope) {
          $scope.item = item;
          $scope.users = users;
        }
      });
      modal.result.then(function (item) {
        console.log(item);
        if(item.id) {
          hasura.query('update', {
            table: 'nptel_center',
            $set: {
              name: item.name,
              state: item.state,
              allotted_user_id: parseInt(item.allotted_user, 10)
            },
            where: {
              id: item.id
            }
          }).then(function (data) {
            getCenters();
          })
        } else {
          hasura.query('insert', {
            table: 'nptel_center',
            objects: [{
              name: item.name,
              state: item.state,
              allotted_user_id: parseInt(item.allotted_user, 10)
            }]
          }).then(function (data) {
            getCenters();
          })
        }
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
    $scope.data = [];
    function processCSV(allText) {
  		// split content based on new line
  		var allTextLines = allText.split(/\r\n|\n/);
  		var headers = allTextLines[0].split(',');
  		var lines = [];

  		for ( var i = 0; i < allTextLines.length; i++) {
  			// split content based on comma
  			var data = allTextLines[i].split(',');
  			if (data.length == headers.length) {
  				var tarr = [];
  				for ( var j = 0; j < headers.length; j++) {
  					tarr.push(data[j]);
  				}
  				lines.push(tarr);
  			}
  		}
  		return lines;
  	};
    var namesArr = [];
    $scope.fileNameChanged = function (ele) {
      var files = ele.files;
      var l = files.length;


      for (var i = 0; i < l; i++) {
        namesArr.push(files[i]);
      }
    }
    $scope.bulkAdd = function() {
      console.log($scope.data);
      console.log(namesArr);
      var reader = new FileReader();
      reader.onload = function () {
        $scope.data = processCSV(reader.result);
        $scope.$apply();
        console.log($scope.data);
        var insert_objects = [];
        for(var item of $scope.data){
          var name = item[0];
          var state = item[1];
          try {
            var allotted_user_id = item[2]
          } catch (e) {
            var allotted_user_id = 0;
          }
          var obj = {
            name: name,
            state: state
          }
          if (allotted_user_id) {
            obj['allotted_user_id'] = allotted_user_id;
          }
          insert_objects.push(obj);
        }
        hasura.query('insert',{
          table: 'nptel_center',
          objects: insert_objects
        }).then(function(data){
          console.log(data);
          getCenters();
        })
      }
      reader.readAsText(namesArr[0]);

    }
  }

})();
