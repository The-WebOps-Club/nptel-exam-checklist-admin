(function () {
  'use strict';

  angular.module('BlurAdmin.pages.sessions')
    .controller('SessionsPageCtrl', SessionsPageCtrl);

  /** @ngInject */
  function SessionsPageCtrl($scope, $uibModal, hasura) {
    var vm = $scope;
    function getSessions(){
      var argq = {
        table: 'nptel_session',
        columns: ['id', 'name', 'date','start_time', 'end_time']
      }
      hasura.query('select', argq).then(function(data){
        $scope.sessions = data;
      })
    }
    getSessions();
    function getCenters(){
      var argq = {
        table: 'nptel_center',
        columns: ['id', 'name', 'state']
      }
      hasura.query('select', argq).then(function(data){
        $scope.centers = data;
      })
    }
    getCenters();
    $scope.syncSessions = function () {
      var objects = [];
      hasura.query('select', {
        table: 'nptel_session_center',
        columns: ['id','session_id', 'center_id']
      }).then(function (data) {
        console.log(data);
        for(var session of $scope.sessions){
          for(var center of $scope.centers) {
            var obj = {
              session_id: session.id,
              center_id: center.id,
              is_visible: true
            }
            var found = false;
            for(var ses_cent_obj of data){
              if (ses_cent_obj.session_id == obj.session_id && ses_cent_obj.center_id == obj.center_id) {
                found = true;
              }
            }
            if(!found){
              objects.push(obj);
            }
          }
        }
        console.log(objects.length);
        if(objects.length != 0){
          return hasura.query('insert', {
            table: 'nptel_session_center',
            objects: objects
          })
        }
      }).then(function(data){
        console.log(data);
      }, function (error){
        console.log(error);
      })

    }
    $scope.openModal = function (item) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'app/pages/sessions/sessionModal.html',
        size: 'md',
        controller: function($scope) {
          $scope.item = item;
        }
      });
      modal.result.then(function (item) {
        console.log(item);
        if(item.id) {
          hasura.query('update',{
            table: 'nptel_session',
            $set: {
              name: item.name,
              date: item.date,
              start_time: item.start_time,
              end_time: item.end_time
            },
            where: {
              id: item.id
            }
          }).then(function(data){
            console.log(data);
            getSessions();
          })
        } else {
          hasura.query('insert',{
            table: 'nptel_session',
            objects: [{
              name: item.name,
              date: item.date,
              start_time: item.start_time,
              end_time: item.end_time
            }]
          }).then(function(data){
            console.log(data);
            getSessions();
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
        // bulk insert
      }
      reader.readAsText(namesArr[0]);

    }
  }

})();
