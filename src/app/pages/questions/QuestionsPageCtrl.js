(function () {
  'use strict';

  angular.module('BlurAdmin.pages.questions')
    .controller('QuestionsPageCtrl', QuestionsPageCtrl);

  /** @ngInject */
  function QuestionsPageCtrl($scope, $uibModal, hasura, editableOptions, editableThemes) {
    $scope.smartTablePageSize = 10;
    var original_questions = [];
    var argq = {
      table: 'nptel_question',
      columns: ['id', 'text', 'level', 'type', 'priority'],
      order_by: '+priority'
    };

    function getQuestions(){
      hasura.query('select', argq).then(function(data){
          $scope.original = data.slice();
          $scope.questions = data.slice();
      }, function(error){
        console.log(error);
      })
    }
    getQuestions();

    $scope.addQuestion = function() {
      $scope.inserted = {
        id: 0,
        text: '',
        level: null,
        type: null,
        priority: 0
      };
      $scope.questions.push($scope.inserted);
    };

    $scope.levels = [
      {value: 1, text: '1'},
      {value: 2, text: '2'},
      {value: 3, text: '3'},
    ];

    $scope.types = [
      {value: 'boolean'},
      {value: 'number'},
      {value: 'long_text'},
      {value: 'timestamp'},
    ];

    $scope.removeUser = function(index) {
      $scope.questions.splice(index, 1);
    };

    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

    $scope.$watch('questions', function (newValue, oldValue, scope) {

      angular.forEach(newValue, function(question){
        if(question.id == 0){
            //new entry, post and refresh list
            var argq = {
              table: 'nptel_question',
              objects: [{
                text: question.text,
                level: parseInt(question.level, 10),
                type: question.type,
                priority: parseInt(question.priority, 10)
              }],
              returning: ['id', 'text', 'level', 'type', 'priority']
            }
            hasura.query('insert', argq).then(function(data){
              getQuestions();
            })
        } else {
          angular.forEach(oldValue, function(oquestion){
            if (question.id == oquestion.id) {
              if(!angular.equals(question, oquestion)){
                console.log('oldwc', oquestion);
                console.log('newwc', question);
                var argq = {
                  table: 'nptel_question',
                  where: {
                    id: question.id
                  },
                  $set: {
                    text: question.text,
                    type: question.type,
                    level: parseInt(question.level, 10),
                    priority: parseInt(question.priority, 10)
                  }
                }
                hasura.query('update', argq).then(function (data) {
                  getQuestions();
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
