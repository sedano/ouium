angular.module('ouium')
  .service('UserService', function ($q, $http, $rootScope, $filter) {
    var USER_PROFILE = 'user_profile';
    var API_ENDPOINT = {
      url: 'http://ouium.herokuapp.com/user'
      // url: 'http://localhost:8100/user'
    }
    $rootScope.user = {};

    function storeUserProfile(user) {
      window.localStorage.setItem(USER_PROFILE, JSON.stringify(user));
      useProfile(user);
    }

    function useProfile(user) {
      user.name = $filter('capitalize')(user.name);
      user.lastname = $filter('capitalize')(user.lastname);
      user.address.city = $filter('capitalize')(user.address.city);
      user.address.country = $filter('capitalize')(user.address.country);
      $rootScope.user = user;
    }

    function destroyUserProfile() {
      window.localStorage.removeItem(USER_PROFILE);
      $rootScope.user = undefined;
    }

    var loadUserProfile = function () {
      return $q(function (resolve, reject) {
        var user = JSON.parse(window.localStorage.getItem(USER_PROFILE));
        if (user) {
          useProfile(user);
          resolve("Local profile loaded")
        } else {
          $http.get(API_ENDPOINT.url + '/profile').then(function (result) {
            if (result.data.success) {
              destroyUserProfile();
              storeUserProfile(result.data.user)
              resolve(result.data.msg);
            } else {
              reject(result.data.msg);
            }
          });
        }
      });
    };

    var updateUserProfile = function (user) {
      return $q(function (resolve, reject) {
        $http.put(API_ENDPOINT.url + '/profile', user).then(function (result) {
          if (result.data.success) {
            destroyUserProfile();
            storeUserProfile(result.data.user);
            resolve(result.data.msg);
          } else {
            reject(result.data.msg);
          }
        });
      });
    };

    var clearUserProfile = function () {
      destroyUserProfile();
    };

    var searchUsers = function (query) {
      return $q(function (resolve, reject) {
        $http.get(API_ENDPOINT.url + '/profile', query).then(function (result) {
          if (result.data.success) {
            resolve(result.data.results);
          } else {
            reject(result.data.msg);
          }
        });
      });
    };

    return {
      loadUserProfile: loadUserProfile,
      updateUserProfile: updateUserProfile,
      clearUserProfile: clearUserProfile,
      searchUsers: searchUsers
    }
  })