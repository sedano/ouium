angular.module('ouium')
  .service('AuthService', function ($q, $http, $rootScope) {
    var LOCAL_TOKEN_KEY = 'token';
    var LOCAL_PROFILE = 'profile';
    var API_ENDPOINT = {
      // url: 'http://ouium.herokuapp.com/auth'
      url: 'http://localhost:8100/auth'
    }
    $rootScope.isAuthenticated = false;
    var authToken;

    function loadUserCredentials() {
      var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
      if (token) {
        useCredentials(token);
      }
    }

    function storeUserProfile(data) {
      window.localStorage.setItem(LOCAL_TOKEN_KEY, data.token);
      window.localStorage.setItem(LOCAL_PROFILE, JSON.stringify(data.user));
      useCredentials(data);
    }

    function useCredentials(data) {
      $rootScope.isAuthenticated = true;
      authToken = data.token;

      // Set the token as header for your requests!
      $http.defaults.headers.common.Authorization = authToken;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      $rootScope.isAuthenticated = false;
      $rootScope.user = undefined;
      $http.defaults.headers.common.Authorization = undefined;
      window.localStorage.clear();
    }

    var signup = function (user) {
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

    var login = function (user) {
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

    var logout = function () {
      destroyUserCredentials();
    };

    loadUserCredentials();

    return {
      login: login,
      signup: signup,
      logout: logout,
      isAuthenticated: function () { return isAuthenticated; }
    };
  })

// .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
//   return {
//     responseError: function (response) {
//       $rootScope.$broadcast({
//         401: AUTH_EVENTS.notAuthenticated,
//       }[response.status], response);
//       return $q.reject(response);
//     }
//   };
// })

// .config(function ($httpProvider) {
//   $httpProvider.interceptors.push('AuthInterceptor');
// });