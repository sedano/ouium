angular.module('ouium')
  .service('DBService', function ($q, $http, $rootScope) {
    var API_ENDPOINT = {
      // url: 'http://ouium.herokuapp.com/auth'
      url: 'http://localhost:8100/auth'
    }
    
    var updateUser = function (user) {
      return $q(function (resolve, reject) {
        $http.post(API_ENDPOINT.url + '/signup', user).then(function (result) {
          if (result.data.success) {
            resolve(result.data.msg);
          } else {
            reject(result.data.msg);
          }
        });
      });
    };

    var deleteUser = function (user) {
      return $q(function (resolve, reject) {
        $http.post(API_ENDPOINT.url + '/login', user).then(function (result) {
          if (result.data.success) {
            destroyUserCredentials();
            storeUserProfile(result.data);
            resolve(result.data);
          } else {
            reject(result.data.msg);
          }
        });
      });
    };

    return {
      updateUser: updateUser,
      deleteUser: deleteUser
    };
  })