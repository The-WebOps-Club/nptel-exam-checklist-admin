(function () {
  'use strict';

  angular.module('BlurAdmin.pages.answers')
    .controller('AnswersPageCtrl', AnswersPageCtrl);

  /** @ngInject */
  function AnswersPageCtrl($scope, $uibModal, hasura) {

        var argq = [
          {
            type: 'select',
            args: {
              table: 'nptel_answer',
              columns: [
                'id', 'session_center_id', 'answers', 'last_updated',
                {name: 'session_center', columns: [
                  {name: 'session', columns: ['name', 'date','start_time', 'end_time']},
                  {name: 'center', columns: ['name', 'state', {name: 'allotted_user', columns: ['id', 'name']}]}
                ]},
              ]
            }
          },
          {
            type: 'select',
            args: {
              table: 'nptel_question',
              columns: ['id', 'text', 'name', 'priority'],
              order_by: '+priority'
            }
          }
        ]

        $scope.getData = function getData() {
          hasura.query('bulk', argq)
            .then(function(data){
              var sessions = data[0];
              var questions = data[1];
              var tableData = [];
              for (var i in sessions) {
                var rowdata = {};
                for(var j in questions) {
                    rowdata['session'] = sessions[i].session_center.session.name + ' at ' + sessions[i].session_center.center.name + ' | ' + sessions[i].session_center.center.allotted_user.name;
                    rowdata[questions[j].id] = sessions[i].answers[questions[j].id];
                }
                tableData.push(rowdata)
              }
              console.log('tableData', tableData);
              console.log('data', data);
              $scope.tableData = tableData;
              $scope.questions = questions;
            }, function(error){
              console.log(error);
            });
        }
        $scope.getData();

  }

})();
