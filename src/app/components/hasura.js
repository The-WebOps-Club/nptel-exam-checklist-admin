(function () {
  'use strict';

  angular.module('BlurAdmin')
  .service('hasura', Hasura);

  function Hasura($q, $http, $window){
    this.authorized = false;
    this.token = '';
    this.appname = "webops.club";
    // this.appname = "ballpoint32.hasura-app.io";
    var token = $window.localStorage.getItem('token');
    this.token = token;
    if (token) {
      $http.defaults.headers.common['Authorization'] = "Bearer " + this.token;
      this.authorized = true;
    }
    var user = undefined
    var hostname = "webops.club";
    // var hostname = "ballpoint32.hasura-app.io";
    var scheme = 'https';
    var endpoints = {
        'auth': scheme + '://auth.' + hostname,
        'data': scheme + '://data.' + hostname,
    }
    this.isSignedIn = function() {
      var deferred = $q.defer();
      if (user) {
          deferred.resolve(user);
      } else {
          $http.get(endpoints.auth + '/user/account/info').then(function(response){
              user = response.data;
              deferred.resolve(response.data);
          }).catch(function(response){
              deferred.reject(response.data.message);
              $log.error(response);
          });
      }
      return deferred.promise;
    }
    this.login = function(username, password){
      console.log(username, password);
      var defer = $q.defer(),
      _this = this; // Don't know a better way
      $http.post('https://auth.'+ this.appname + '/login', {
        "username":username,
        "password":password})
        .success(function(data) {
          _this.token = data['auth_token'];
          $window.localStorage.setItem('token', _this.token)
          $http.defaults.headers.common['Authorization'] = "Bearer " + _this.token;
          _this.authorized = true;
          defer.resolve();
          })
        .error(function(data) {
          defer.reject(data);
        });
        return defer.promise;
    };
    this.logout = function(){
      this.token = '';
      this.authorized = false;
      $http.defaults.headers.common['Authorization'] ='';
      $window.localStorage.clear();
    };
    this.query = function(type, args){
      var defer = $q.defer(),
          query = angular.toJson(
            {"type": type,
             "args": args
            });

      $http.post('https://data.' + this.appname + '/v1/query', query)
      .success(function(data){
        defer.resolve(data);
      })
      .error(function(data){
        defer.reject(data)
      })
      return defer.promise;
    };
    this.admin = {
      createUser: function(payload) {
        var defer = $q.defer(),
            data = angular.toJson(payload);
        $http.post(endpoints.auth + '/admin/user/create', data)
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(data){
            defer.reject(data);
        })
        return defer.promise;
      }
    }
  };

})();
