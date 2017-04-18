(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users')
    .controller('UsersPageCtrl', UsersPageCtrl);

  /** @ngInject */
  function UsersPageCtrl($scope, $uibModal, hasura) {
    function getUsers(){
      var argq = {
        table: 'nptel_user',
        columns: ['id', 'name', 'email']
      }
      hasura.query('select', argq).then(function(data){
        $scope.users = data;
      })
    }
    getUsers();

    $scope.openUserModal = function (user) {
      var userModal = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/users/userModal.html',
        size: 'md',
        controller: function($scope) {
          $scope.user = user;
        }
      });
      userModal.result.then(function (user) {
        console.log(user);
        if(user.id) {
          // edit user
        } else {
          hasura.admin.createUser({
            username: user.email,
            email: user.email,
            password: user.password
          }).then(function(data){
            return hasura.query('insert', {
              table: 'nptel_user',
              objects: [{
                id: data.hasura_id,
                name: user.name,
                email: user.email
              }],
              returning: ['id', 'name', 'email']
            })
          }).then(function (data) {
            $scope.users.push(data.returning[0]);
          })
        }
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
    $scope.userData = [];
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
      console.log($scope.userData);
      console.log(namesArr);
      var reader = new FileReader();
      reader.onload = function () {
        $scope.userData = processCSV(reader.result);
        $scope.$apply();
        console.log($scope.userData);
        angular.forEach($scope.userData, function(user){
          var name = user[0];
          var email = user[1];
          hasura.admin.createUser({
            username: email,
            email: email,
            password: email
          }).then(function(data){
            return hasura.query('insert', {
              table: 'nptel_user',
              objects: [{
                id: data.hasura_id,
                name: name,
                email: email
              }],
              returning: ['id', 'name', 'email']
            })
          }).then(function (data) {
            $scope.users.push(data.returning[0]);
          })
        })
      }
      reader.readAsText(namesArr[0]);

    }
  }

})();
